import { Module } from "@nestjs/common";

import { RestaurantsModule } from "../restaurants/restaurants.module";
import { AvailabilityService } from "./availability.service";

@Module({
  imports: [RestaurantsModule],
  providers: [AvailabilityService],
  exports: [AvailabilityService]
})
export class AvailabilityModule {}
