import { AdminBookingSummary } from "@/lib/types/admin";

import { StatusBadge } from "./status-badge";

export function BookingDayScheduleTable({
  bookings,
  selectedBookingId,
  onSelectBooking
}: {
  bookings: AdminBookingSummary[];
  selectedBookingId: string | null;
  onSelectBooking: (booking: AdminBookingSummary) => void;
}) {
  return (
    <section className="space-y-4" data-booking-selection-root>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Today&apos;s Schedule</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-outline-soft)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[var(--color-surface-muted)] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3 text-center">Covers</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-soft)] text-sm">
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const selected = booking.id === selectedBookingId;

                  return (
                    <tr
                      key={booking.id}
                      onClick={() => onSelectBooking(booking)}
                      className={`transition hover:bg-[var(--color-page)] ${
                        selected
                          ? "border-l-4 border-[var(--color-primary)] bg-[rgba(193,236,212,0.28)]"
                          : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => onSelectBooking(booking)}
                          className="font-semibold text-[var(--color-primary)]"
                        >
                          {booking.bookingStartTime}
                        </button>
                      </td>
                      <td className="px-4 py-4 font-medium text-[var(--color-text)]">
                        {booking.customerName}
                      </td>
                      <td className="px-4 py-4 text-center text-[var(--color-text)]">
                        {booking.guestCount}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-14 text-center text-sm text-[var(--color-muted)]"
                  >
                    No active bookings for this day.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
