import { BookingCreationStatus } from "@/lib/types/public-booking";

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export type BookingSummaryItem = {
  kind: "date" | "time" | "guests";
  label: string;
};

export type BookingResultState = {
  status: BookingCreationStatus;
  bookingId?: string;
};
