import { BookingDayBoardPage } from "@/components/admin/booking-day-board-page";
import { fetchAdminBookings } from "@/lib/api/admin";
import { normalizeBoardDate } from "@/lib/admin/day-board-date";

function readString(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function AdminBookingDayPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const selectedDate = normalizeBoardDate(readString(resolvedSearchParams.date));
  const { bookings, dayContext } = await fetchAdminBookings({
    status: "active",
    date: selectedDate
  });

  return (
    <BookingDayBoardPage
      selectedDate={selectedDate}
      bookings={bookings}
      dayContext={dayContext}
    />
  );
}
