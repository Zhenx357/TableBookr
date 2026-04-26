import { Injectable } from "@nestjs/common";
import { BookingSource, BookingStatus } from "@prisma/client";

import { AvailabilityService } from "../availability/availability.service";
import { dbDateFromIsoDate, dbTimeFromMinutes } from "../availability/availability.utils";
import { PrismaService } from "../prisma/prisma.service";

type CreateBookingResult =
  | {
      status: "blocked";
    }
  | {
      bookingId: string;
      status: "confirmed" | "pending";
    };

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService
  ) {}

  async createBooking(
    slug: string,
    input: {
      guestCount: number;
      date: string;
      time: string;
      name: string;
      email: string;
      phone: string;
    }
  ): Promise<CreateBookingResult> {
    const evaluation = await this.availabilityService.evaluateBookingRequest(slug, {
      date: input.date,
      time: input.time,
      guestCount: input.guestCount
    });

    if (evaluation.outcome === "blocked") {
      return { status: "blocked" };
    }

    const createdBooking = await this.prisma.booking.create({
      data: {
        restaurantId: evaluation.restaurant.id,
        customerName: input.name.trim(),
        customerEmail: input.email.trim().toLowerCase(),
        customerPhone: input.phone.trim(),
        guestCount: input.guestCount,
        bookingDate: dbDateFromIsoDate(input.date),
        bookingStartTime: dbTimeFromMinutes(evaluation.requestedStartMinutes),
        bookingEndTime: dbTimeFromMinutes(evaluation.requestedEndMinutes),
        status:
          evaluation.outcome === "confirmed"
            ? BookingStatus.CONFIRMED
            : BookingStatus.PENDING,
        source: BookingSource.WEBSITE
      }
    });

    return {
      bookingId: createdBooking.id,
      status: evaluation.outcome
    };
  }
}
