import { AdminBookingSummary } from "@/lib/types/admin";

export type PositionedAdminBooking = AdminBookingSummary & {
  startMinutes: number;
  endMinutes: number;
  laneIndex: number;
};

export function parseBoardTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function layoutBookingBoard(bookings: AdminBookingSummary[]) {
  const lanes: PositionedAdminBooking[][] = [];
  const positionedBookings = bookings
    .map((booking) => ({
      ...booking,
      startMinutes: parseBoardTimeToMinutes(booking.bookingStartTime),
      endMinutes: parseBoardTimeToMinutes(booking.bookingEndTime),
      laneIndex: 0
    }))
    .sort(
      (left, right) =>
        left.startMinutes - right.startMinutes || left.endMinutes - right.endMinutes
    );

  for (const booking of positionedBookings) {
    let laneIndex = lanes.findIndex((lane) => {
      const lastBooking = lane[lane.length - 1];
      return lastBooking.endMinutes <= booking.startMinutes;
    });

    if (laneIndex === -1) {
      laneIndex = lanes.length;
      lanes.push([]);
    }

    // Lane position belongs to the current day's overlap set, so it should stay computed here.
    booking.laneIndex = laneIndex;
    lanes[laneIndex].push(booking);
  }

  return {
    bookings: positionedBookings,
    laneCount: Math.max(lanes.length, 1)
  };
}
