import { RestaurantContext } from "../restaurants/restaurants.types";

export type AvailabilityStatus = "available" | "pending" | "blocked";
export type BookingOutcomeStatus = "confirmed" | "pending" | "blocked";

export interface AvailabilitySlotResponse {
  time: string;
  status: AvailabilityStatus;
}

export interface BookingEvaluation {
  restaurant: RestaurantContext;
  date: string;
  requestedStartMinutes: number;
  requestedEndMinutes: number;
  outcome: BookingOutcomeStatus;
}

export interface ActiveBookingInterval {
  guestCount: number;
  startMinutes: number;
  endMinutes: number;
}
