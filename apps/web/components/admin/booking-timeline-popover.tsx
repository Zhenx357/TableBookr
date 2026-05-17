import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";

import {
  formatAdminDate,
  formatAdminCreatedAt,
  formatAdminTimeRange
} from "@/lib/admin/format";
import { AdminBookingSummary } from "@/lib/types/admin";

import {
  CalendarIcon,
  ClockIcon,
  CloseIcon,
  GuestsIcon,
  MailIcon,
  PhoneIcon
} from "./admin-shell-icons";
import { StatusBadge } from "./status-badge";

export function BookingTimelinePopover({
  booking,
  onClose
}: {
  booking: AdminBookingSummary;
  onClose: () => void;
}) {
  function handleClose(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.blur();
    onClose();
  }

  return (
    <div className="w-[22rem] rounded-xl border border-[var(--color-outline-soft)] bg-white shadow-[0_20px_55px_rgba(26,28,30,0.16)]">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--color-outline-soft)] px-4 py-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">{booking.customerName}</h3>
          <StatusBadge status={booking.status} />
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-full p-1.5 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
          aria-label="Close booking details"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 px-4 py-4 text-sm">
        <InfoRow
          icon={<CalendarIcon className="h-[18px] w-[18px]" />}
          value={`${formatAdminDate(booking.bookingDate)} • ${formatAdminTimeRange(
            booking.bookingStartTime,
            booking.bookingEndTime
          )}`}
        />
        <InfoRow
          icon={<GuestsIcon className="h-[18px] w-[18px]" />}
          value={`${booking.guestCount} people`}
        />
        <InfoRow
          icon={<PhoneIcon className="h-[18px] w-[18px]" />}
          value={booking.customerPhone}
          valueClassName="text-[var(--color-primary)]"
        />
        <InfoRow
          icon={<MailIcon className="h-[18px] w-[18px]" />}
          value={booking.customerEmail}
          valueClassName="text-[var(--color-primary)]"
        />
        <InfoRow
          icon={<ClockIcon className="h-[18px] w-[18px]" />}
          value={`Created ${formatAdminCreatedAt(booking.createdAt)}`}
        />
      </div>

      <div className="border-t border-[var(--color-outline-soft)] px-4 py-4">
        <Link
          href={`/admin/bookings/${booking.id}`}
          className="flex min-h-11 items-center justify-center rounded-lg border border-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[#f3f7f4]"
        >
          Open full booking
        </Link>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  value,
  valueClassName
}: {
  icon: ReactNode;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[var(--color-muted)]">{icon}</div>
      <p className={`text-sm text-[var(--color-text)] ${valueClassName || ""}`}>{value}</p>
    </div>
  );
}
