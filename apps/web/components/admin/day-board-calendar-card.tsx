"use client";

import { DayPicker } from "react-day-picker";

import { ChevronLeftIcon, ChevronRightIcon } from "./admin-shell-icons";

export function DayBoardCalendarCard({
  month,
  selectedDate,
  isPending,
  onMonthChange,
  onSelectDate,
  onPreviousDay,
  onNextDay,
  monthLabel,
  selectedDayLabel
}: {
  month: Date;
  selectedDate: Date;
  isPending: boolean;
  monthLabel: string;
  selectedDayLabel: string;
  onMonthChange: (month: Date) => void;
  onSelectDate: (date: Date | undefined) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-outline-soft)] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-[var(--color-text)]">{monthLabel}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPreviousDay}
            className="rounded-md p-1 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Previous day"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNextDay}
            className="rounded-md p-1 text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Next day"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 text-center text-xs font-semibold text-[var(--color-primary)]">
        {selectedDayLabel}
      </div>

      <div className="admin-day-picker mt-4 overflow-hidden">
        <DayPicker
          month={month}
          onMonthChange={onMonthChange}
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          fixedWeeks
          showOutsideDays
          hideNavigation
          className={isPending ? "opacity-70" : undefined}
        />
      </div>
    </section>
  );
}
