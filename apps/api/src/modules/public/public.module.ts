import { Module } from "@nestjs/common";

import { AvailabilityModule } from "../availability/availability.module";
import { BookingsModule } from "../bookings/bookings.module";
import { RestaurantsModule } from "../restaurants/restaurants.module";
import { PublicController } from "./public.controller";

@Module({
  imports: [RestaurantsModule, AvailabilityModule, BookingsModule],
  controllers: [PublicController]
})
export class PublicModule {}
