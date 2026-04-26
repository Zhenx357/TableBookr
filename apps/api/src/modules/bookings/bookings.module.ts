import { Module } from "@nestjs/common";

import { AvailabilityModule } from "../availability/availability.module";
import { BookingsService } from "./bookings.service";

@Module({
  imports: [AvailabilityModule],
  providers: [BookingsService],
  exports: [BookingsService]
})
export class BookingsModule {}
