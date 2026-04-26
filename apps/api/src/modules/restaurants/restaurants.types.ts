import { Prisma } from "@prisma/client";

type RestaurantContextBase = Prisma.RestaurantGetPayload<{
  include: {
    settings: true;
    openingHours: true;
    closedDates: true;
  };
}>;

export type RestaurantContext = RestaurantContextBase & {
  settings: NonNullable<RestaurantContextBase["settings"]>;
};

export interface PublicRestaurantResponse {
  name: string;
  slug: string;
  timezone: string;
  maxOnlinePartySize: number;
  slotIntervalMinutes: number;
  bookingDurationMinutes: number;
}
