"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  addDaysToIsoDate,
  isoDateToLocalDate,
  localDateToIsoDate
} from "@/lib/admin/day-board-date";
import {
  formatAdminDateWithDay,
  formatAdminMonthYear,
  formatAdminServiceRange
} from "@/lib/admin/format";
import { AdminBookingDayContext, AdminBookingSummary } from "@/lib/types/admin";

import { BookingDetailsPanel } from "./booking-details-panel";
import { BookingDayScheduleTable } from "./booking-day-schedule-table";
import { BookingDayTimeline } from "./booking-day-timeline";
import { DayBoardCalendarCard } from "./day-board-calendar-card";
import { DayBoardSummaryCards } from "./day-board-summary-cards";

export function BookingDayBoardPage({
  selectedDate,
  bookings,
  dayContext
}: {
  selectedDate: string;
  bookings: AdminBookingSummary[];
  dayContext?: AdminBookingDayContext;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    bookings[0]?.id ?? null
  );
  const [calendarMonth, setCalendarMonth] = useState(() => isoDateToLocalDate(selectedDate));
  const selectedBooking = bookings.find((booking) => booking.id === selectedBookingId) || null;
  const bookingCount = bookings.length;
  const totalGuests = bookings.reduce((sum, booking) => sum + booking.guestCount, 0);
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const serviceLabel = formatAdminServiceRange(dayContext);
  const serviceProgressPercent = getServiceProgressPercent(selectedDate, dayContext);

  useEffect(() => {
    setCalendarMonth(isoDateToLocalDate(selectedDate));
    setSelectedBookingId(bookings[0]?.id ?? null);
  }, [bookings, selectedDate]);

  function navigateToDate(nextDate: string) {
    startTransition(() => {
      router.replace(`/admin/bookings/day?date=${nextDate}`);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)_20rem]">
      <aside className="space-y-4">
        <DayBoardCalendarCard
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          selectedDate={isoDateToLocalDate(selectedDate)}
          onSelectDate={(nextDate) => {
            if (!nextDate) {
              return;
            }

            navigateToDate(localDateToIsoDate(nextDate));
          }}
          onPreviousDay={() => navigateToDate(addDaysToIsoDate(selectedDate, -1))}
          onNextDay={() => navigateToDate(addDaysToIsoDate(selectedDate, 1))}
          monthLabel={formatAdminMonthYear(calendarMonth)}
          selectedDayLabel={formatAdminDateWithDay(selectedDate)}
          isPending={isPending}
        />

        <DayBoardSummaryCards
          bookingCount={bookingCount}
          totalGuests={totalGuests}
          pendingCount={pendingCount}
          serviceLabel={serviceLabel}
          serviceProgressPercent={serviceProgressPercent}
        />
      </aside>

      <section className="space-y-6">
        <BookingDayTimeline
          bookings={bookings}
          dayContext={dayContext}
          selectedDate={selectedDate}
          selectedBookingId={selectedBookingId}
          onSelectBooking={(booking) => setSelectedBookingId(booking.id)}
        />
        <BookingDayScheduleTable
          bookings={bookings}
          selectedBookingId={selectedBookingId}
          onSelectBooking={(booking) => setSelectedBookingId(booking.id)}
        />
      </section>

      <BookingDetailsPanel
        booking={selectedBooking}
        onClearSelection={() => setSelectedBookingId(null)}
      />
    </div>
  );
}

function getServiceProgressPercent(
  selectedDate: string,
  dayContext?: AdminBookingDayContext
) {
  if (!dayContext) {
    return 0;
  }

  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Copenhagen",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  if (selectedDate !== today) {
    return 100;
  }

  const [startHours, startMinutes] = dayContext.serviceStartTime.split(":").map(Number);
  const [endHours, endMinutes] = dayContext.serviceEndTime.split(":").map(Number);
  const start = startHours * 60 + startMinutes;
  const end = endHours * 60 + endMinutes;
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  if (current <= start) {
    return 0;
  }

  if (current >= end) {
    return 100;
  }

  return Math.round(((current - start) / Math.max(end - start, 1)) * 100);
}
