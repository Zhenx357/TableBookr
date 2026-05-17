import type { ReactNode } from "react";

import { BookingsIcon, ClockIcon, GuestsIcon } from "./admin-shell-icons";

export function DayBoardSummaryCards({
  bookingCount,
  totalGuests,
  pendingCount,
  serviceLabel,
  serviceProgressPercent
}: {
  bookingCount: number;
  totalGuests: number;
  pendingCount: number;
  serviceLabel: string;
  serviceProgressPercent: number;
}) {
  return (
    <div className="grid gap-4">
      <MetricCard
        label="Bookings"
        value={`${bookingCount}`}
        icon={<BookingsIcon className="h-9 w-9" />}
      />
      <MetricCard
        label="Total Guests"
        value={`${totalGuests}`}
        icon={<GuestsIcon className="h-9 w-9" />}
      />
      <MetricCard
        label="Pending"
        value={`${pendingCount}`}
        valueClassName="text-[var(--color-error-strong)]"
        icon={<ClockIcon className="h-9 w-9" />}
      />

      <section className="rounded-xl bg-[var(--color-primary-container)] p-4 text-[var(--color-primary-fixed)] shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">
          Service Hours
        </p>
        <p className="mt-2 text-lg font-semibold">{serviceLabel}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-[var(--color-primary-fixed)]"
            style={{ width: `${serviceProgressPercent}%` }}
          />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  valueClassName
}: {
  label: string;
  value: string;
  icon: ReactNode;
  valueClassName?: string;
}) {
  return (
    <section className="flex items-center justify-between rounded-xl border border-[var(--color-outline-soft)] bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {label}
        </p>
        <p className={`mt-2 text-[1.75rem] font-semibold text-[var(--color-text)] ${valueClassName || ""}`}>
          {value}
        </p>
      </div>
      <div className="text-[rgba(27,67,50,0.22)]">{icon}</div>
    </section>
  );
}
