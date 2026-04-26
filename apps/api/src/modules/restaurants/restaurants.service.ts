import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { PublicRestaurantResponse, RestaurantContext } from "./restaurants.types";

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRestaurantContextBySlug(slug: string): Promise<RestaurantContext> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: {
        settings: true,
        openingHours: true,
        closedDates: true
      }
    });

    if (!restaurant) {
      throw new NotFoundException("Restaurant not found");
    }

    if (!restaurant.settings) {
      throw new InternalServerErrorException("Restaurant settings are not configured");
    }

    return restaurant as RestaurantContext;
  }

  async getPublicRestaurantBySlug(slug: string): Promise<PublicRestaurantResponse> {
    const restaurant = await this.getRestaurantContextBySlug(slug);

    return {
      name: restaurant.name,
      slug: restaurant.slug,
      timezone: restaurant.timezone,
      maxOnlinePartySize: restaurant.settings.maxOnlinePartySize,
      slotIntervalMinutes: restaurant.settings.bookingSlotMinutes,
      bookingDurationMinutes: restaurant.settings.bookingDurationMinutes
    };
  }
}
