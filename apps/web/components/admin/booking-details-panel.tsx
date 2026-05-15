import type { ReactNode } from "react";
import Link from "next/link";

import {
  formatAdminCreatedAt,
  formatAdminDateWithDay,
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

export function BookingDetailsPanel({
  booking,
  onClearSelection
}: {
  booking: AdminBookingSummary | null;
  onClearSelection?: () => void;
}) {
  return (
    <aside className="flex min-h-[320px] flex-col rounded-xl border border-[var(--color-outline-soft)] bg-white shadow-sm xl:sticky xl:top-24 xl:max-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-outline-soft)] px-4 py-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Booking Details</h2>
        {booking && onClearSelection ? (
          <button
            type="button"
            onClick={onClearSelection}
            className="rounded-full p-1 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Clear selected booking"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {booking ? (
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-6 px-4 py-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-container)] text-xl font-semibold text-white">
                {getInitials(booking.customerName)}
              </div>
              <h3 className="mt-4 text-3xl font-semibold text-[var(--color-text)]">
                {booking.customerName}
              </h3>
              <div className="mt-3">
                <StatusBadge status={booking.status} />
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow
                icon={<CalendarIcon className="h-[18px] w-[18px]" />}
                label="Date"
                value={formatAdminDateWithDay(booking.bookingDate)}
              />
              <InfoRow
                icon={<ClockIcon className="h-[18px] w-[18px]" />}
                label="Time"
                value={`${formatAdminTimeRange(
                  booking.bookingStartTime,
                  booking.bookingEndTime
                )} (2 hrs)`}
              />
              <InfoRow
                icon={<GuestsIcon className="h-[18px] w-[18px]" />}
                label="Guests"
                value={`${booking.guestCount} people`}
              />
              <InfoRow
                icon={<PhoneIcon className="h-[18px] w-[18px]" />}
                label="Phone"
                value={booking.customerPhone}
                valueClassName="text-[var(--color-primary)]"
              />
              <InfoRow
                icon={<MailIcon className="h-[18px] w-[18px]" />}
                label="Email"
                value={booking.customerEmail}
                valueClassName="text-[var(--color-primary)]"
              />
            </div>

            <hr className="border-[var(--color-outline-soft)]" />

            <div className="space-y-3 text-sm">
              <MetaRow label="Source" value="Web reservation" />
              <MetaRow label="Created" value={formatAdminCreatedAt(booking.createdAt)} />
              <div className="rounded-lg bg-[var(--color-surface-muted)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Internal Note
                </p>
                <p className="mt-2 text-sm text-[var(--color-text)]">
                  Not available in Phase 1 yet.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-outline-soft)] px-4 py-4">
            <div className="space-y-2">
              <Link
                href={`/admin/bookings/${booking.id}`}
                className="flex min-h-11 items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition hover:bg-[#173b2e]"
              >
                Open full booking
              </Link>
              <button
                type="button"
                disabled
                className="flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-lg border border-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-primary)] opacity-60"
              >
                Edit Reservation
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 py-16 text-center text-sm text-[var(--color-muted)]">
          Select a booking from the board or schedule to inspect its details.
        </div>
      )}
    </aside>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueClassName
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[var(--color-muted)]">{icon}</div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
          {label}
        </p>
        <p className={`mt-1 text-sm font-medium text-[var(--color-text)] ${valueClassName || ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className="text-right font-medium text-[var(--color-text)]">{value}</span>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
