import { BadRequestException, Injectable } from "@nestjs/common";
import { BookingStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { RestaurantsService } from "../restaurants/restaurants.service";
import { RestaurantContext } from "../restaurants/restaurants.types";
import {
  buildAffectedSlotStarts,
  dbDateFromIsoDate,
  dbDateToIsoDate,
  dbTimeToMinutes,
  findOpeningHoursForDate,
  generateStartTimes,
  intervalsOverlap,
  meetsMinimumLeadTime,
  minutesToTimeString,
  parseIsoDate,
  parseTimeToMinutes
} from "./availability.utils";
import {
  ActiveBookingInterval,
  AvailabilitySlotResponse,
  BookingEvaluation,
  BookingOutcomeStatus
} from "./availability.types";

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly restaurantsService: RestaurantsService
  ) {}

  async getAvailability(
    slug: string,
    input: { date: string; guestCount: number }
  ): Promise<{ slots: AvailabilitySlotResponse[] }> {
    const restaurant = await this.restaurantsService.getRestaurantContextBySlug(slug);
    this.validateGuestCount(input.guestCount, restaurant.settings.maxOnlinePartySize);

    const bookingDate = parseIsoDate(input.date, restaurant.timezone);

    if (this.isClosedDate(restaurant, input.date)) {
      return { slots: [] };
    }

    const openingHours = findOpeningHoursForDate(restaurant.openingHours, bookingDate);

    if (!openingHours?.isOpen || !openingHours.openTime || !openingHours.closeTime) {
      return { slots: [] };
    }

    const slotStarts = this.getOpenSlotStarts(restaurant, input.date);
    const activeBookings = await this.getActiveBookingIntervals(restaurant.id, input.date);

    return {
      slots: slotStarts.map((startMinutes) => ({
        time: minutesToTimeString(startMinutes),
        status: this.mapOutcomeToAvailabilityStatus(
          this.calculateBookingOutcome(
            activeBookings,
            input.guestCount,
            startMinutes,
            restaurant.settings.bookingDurationMinutes,
            restaurant.settings.bookingSlotMinutes,
            restaurant.settings.autoConfirmThreshold,
            restaurant.settings.hardCapacityLimit
          )
        )
      }))
    };
  }

  async evaluateBookingRequest(
    slug: string,
    input: { date: string; time: string; guestCount: number }
  ): Promise<BookingEvaluation> {
    const restaurant = await this.restaurantsService.getRestaurantContextBySlug(slug);
    this.validateGuestCount(input.guestCount, restaurant.settings.maxOnlinePartySize);

    const bookingDate = parseIsoDate(input.date, restaurant.timezone);

    if (this.isClosedDate(restaurant, input.date)) {
      throw new BadRequestException("Restaurant is closed for booking on this date");
    }

    const openingHours = findOpeningHoursForDate(restaurant.openingHours, bookingDate);

    if (!openingHours?.isOpen || !openingHours.openTime || !openingHours.closeTime) {
      throw new BadRequestException("Restaurant is closed for booking on this date");
    }

    const requestedStartMinutes = parseTimeToMinutes(input.time);
    const openSlotStarts = this.getOpenSlotStarts(restaurant, input.date, false);

    if (!openSlotStarts.includes(requestedStartMinutes)) {
      throw new BadRequestException("Booking time must be within opening hours");
    }

    const eligibleSlotStarts = this.getOpenSlotStarts(restaurant, input.date, true);

    if (!eligibleSlotStarts.includes(requestedStartMinutes)) {
      throw new BadRequestException("Booking does not meet minimum lead time");
    }

    const activeBookings = await this.getActiveBookingIntervals(restaurant.id, input.date);
    const outcome = this.calculateBookingOutcome(
      activeBookings,
      input.guestCount,
      requestedStartMinutes,
      restaurant.settings.bookingDurationMinutes,
      restaurant.settings.bookingSlotMinutes,
      restaurant.settings.autoConfirmThreshold,
      restaurant.settings.hardCapacityLimit
    );

    return {
      restaurant,
      date: input.date,
      requestedStartMinutes,
      requestedEndMinutes:
        requestedStartMinutes + restaurant.settings.bookingDurationMinutes,
      outcome
    };
  }

  private async getActiveBookingIntervals(
    restaurantId: string,
    date: string
  ): Promise<ActiveBookingInterval[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        restaurantId,
        bookingDate: dbDateFromIsoDate(date),
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
        }
      },
      orderBy: {
        bookingStartTime: "asc"
      }
    });

    return bookings.map((booking) => ({
      guestCount: booking.guestCount,
      startMinutes: dbTimeToMinutes(booking.bookingStartTime),
      endMinutes: dbTimeToMinutes(booking.bookingEndTime)
    }));
  }

  private getOpenSlotStarts(
    restaurant: RestaurantContext,
    date: string,
    applyLeadTime = true
  ): number[] {
    const bookingDate = parseIsoDate(date, restaurant.timezone);
    const openingHours = findOpeningHoursForDate(restaurant.openingHours, bookingDate);

    if (!openingHours?.isOpen || !openingHours.openTime || !openingHours.closeTime) {
      return [];
    }

    const openTimeMinutes = dbTimeToMinutes(openingHours.openTime);
    const closeTimeMinutes = dbTimeToMinutes(openingHours.closeTime);
    const slotStarts = generateStartTimes(
      openTimeMinutes,
      closeTimeMinutes,
      restaurant.settings.bookingSlotMinutes
    );

    if (!applyLeadTime) {
      return slotStarts;
    }

    return slotStarts.filter((startMinutes) =>
      meetsMinimumLeadTime(
        date,
        startMinutes,
        restaurant.timezone,
        restaurant.settings.minimumLeadTimeMinutes
      )
    );
  }

  private calculateBookingOutcome(
    activeBookings: ActiveBookingInterval[],
    requestedGuestCount: number,
    startMinutes: number,
    durationMinutes: number,
    slotMinutes: number,
    autoConfirmThreshold: number,
    hardCapacityLimit: number
  ): BookingOutcomeStatus {
    const affectedSlotStarts = buildAffectedSlotStarts(
      startMinutes,
      durationMinutes,
      slotMinutes
    );

    let hasPendingThreshold = false;

    for (const affectedStart of affectedSlotStarts) {
      const affectedEnd = affectedStart + slotMinutes;
      const existingGuests = activeBookings.reduce((total, booking) => {
        if (intervalsOverlap(booking.startMinutes, booking.endMinutes, affectedStart, affectedEnd)) {
          return total + booking.guestCount;
        }

        return total;
      }, 0);
      const resultingGuests = existingGuests + requestedGuestCount;

      if (resultingGuests > hardCapacityLimit) {
        return "blocked";
      }

      if (resultingGuests > autoConfirmThreshold) {
        hasPendingThreshold = true;
      }
    }

    return hasPendingThreshold ? "pending" : "confirmed";
  }

  private isClosedDate(restaurant: RestaurantContext, date: string): boolean {
    return restaurant.closedDates.some((closedDate) => dbDateToIsoDate(closedDate.date) === date);
  }

  private mapOutcomeToAvailabilityStatus(
    outcome: BookingOutcomeStatus
  ): AvailabilitySlotResponse["status"] {
    if (outcome === "confirmed") {
      return "available";
    }

    return outcome;
  }

  private validateGuestCount(guestCount: number, maxOnlinePartySize: number) {
    if (guestCount < 1 || guestCount > maxOnlinePartySize) {
      throw new BadRequestException(
        `Guest count must be between 1 and ${maxOnlinePartySize}`
      );
    }
  }
}
