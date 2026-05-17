import { layoutBookingBoard, parseBoardTimeToMinutes } from "@/lib/admin/booking-board-layout";
import { AdminBookingDayContext, AdminBookingSummary } from "@/lib/types/admin";

import { BookingTimelinePopover } from "./booking-timeline-popover";

const LANE_HEIGHT = 72;
const BLOCK_HEIGHT = 56;
const GRID_STEP_MINUTES = 30;

function snapStartToGrid(minutes: number) {
  return Math.floor(minutes / GRID_STEP_MINUTES) * GRID_STEP_MINUTES;
}

function snapEndToGrid(minutes: number) {
  return Math.ceil(minutes / GRID_STEP_MINUTES) * GRID_STEP_MINUTES;
}

function buildGridTicks(startMinutes: number, endMinutes: number) {
  const ticks: number[] = [];

  for (let current = startMinutes; current <= endMinutes; current += GRID_STEP_MINUTES) {
    ticks.push(current);
  }

  if (ticks[ticks.length - 1] !== endMinutes) {
    ticks.push(endMinutes);
  }

  return ticks;
}

function formatTick(minutes: number) {
  const hours = `${Math.floor(minutes / 60)}`.padStart(2, "0");
  const mins = `${minutes % 60}`.padStart(2, "0");
  return `${hours}:${mins}`;
}

function isFullHour(minutes: number) {
  return minutes % 60 === 0;
}

function getTickPositionPercent(startMinutes: number, endMinutes: number, tickMinutes: number) {
  return ((tickMinutes - startMinutes) / Math.max(endMinutes - startMinutes, 1)) * 100;
}

export function BookingDayTimeline({
  bookings,
  dayContext,
  selectedDate,
  selectedBookingId,
  onSelectBooking,
  onClearSelection
}: {
  bookings: AdminBookingSummary[];
  dayContext?: AdminBookingDayContext;
  selectedDate: string;
  selectedBookingId: string | null;
  onSelectBooking: (booking: AdminBookingSummary) => void;
  onClearSelection: () => void;
}) {
  if (!dayContext) {
    return (
      <section className="overflow-hidden rounded-xl border border-[var(--color-outline-soft)] bg-white shadow-sm">
        <div className="border-b border-[var(--color-outline-soft)] bg-[var(--color-surface-muted)] px-4 py-3">
          <h2 className="text-sm font-medium text-[var(--color-muted)]">Reservation Timeline</h2>
        </div>
        <div className="px-6 py-16 text-center text-sm text-[var(--color-muted)]">
          No service window is available for this day.
        </div>
      </section>
    );
  }

  const boardStartMinutes = snapStartToGrid(parseBoardTimeToMinutes(dayContext.serviceStartTime));
  const boardEndMinutes = snapEndToGrid(parseBoardTimeToMinutes(dayContext.serviceEndTime));
  const totalMinutes = Math.max(boardEndMinutes - boardStartMinutes, 60);
  const laidOutBoard = layoutBookingBoard(bookings);
  const gridTicks = buildGridTicks(boardStartMinutes, boardEndMinutes);
  const gridColumnTemplate = `repeat(${Math.max(gridTicks.length - 1, 1)}, minmax(0, 1fr))`;
  const boardHeight = Math.max(laidOutBoard.laneCount * LANE_HEIGHT + 8, 120);
  const currentTime = getCurrentTimeMarker(selectedDate, boardStartMinutes, boardEndMinutes);

  return (
    <section
      className="relative overflow-visible rounded-xl border border-[var(--color-outline-soft)] bg-white shadow-sm"
      data-booking-selection-root
    >
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-outline-soft)] bg-[var(--color-surface-muted)] px-4 py-3">
        <h2 className="text-sm font-medium text-[var(--color-muted)]">Reservation Timeline</h2>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
          <Legend tone="bg-[var(--color-primary)]" label="Confirmed" />
          <Legend tone="bg-[#fff8e8] border border-[#e3cf9d]" label="Pending" />
          <span className="hidden font-medium italic text-[var(--color-muted)]/80 xl:inline">
            {selectedBookingId
              ? "Reservation selected"
              : "Select a reservation to view details"}
          </span>
        </div>
      </div>

      <div className="w-full">
        <div className="relative h-11 border-b border-[var(--color-outline-soft)] bg-white">
          {gridTicks.map((tick, index) => {
            const isFirst = index === 0;
            const isLast = index === gridTicks.length - 1;
            const fullHour = isFullHour(tick);
            const position = getTickPositionPercent(boardStartMinutes, boardEndMinutes, tick);

            return (
              <div
                key={`header-label-${tick}`}
                className={`absolute whitespace-nowrap ${
                  fullHour
                    ? "text-[11px] font-semibold text-[var(--color-text)]"
                    : "text-[10px] font-medium text-[var(--color-muted)]"
                } ${
                  isFirst
                    ? "left-0 -translate-x-0"
                    : isLast
                      ? "right-0 translate-x-0"
                      : "-translate-x-1/2"
                }`}
                style={
                  isFirst || isLast
                    ? { top: "50%", transform: "translateY(-50%)" }
                    : {
                        left: `${position}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)"
                      }
                }
              >
                {formatTick(tick)}
              </div>
            );
          })}
        </div>

        <div className="relative bg-[#fcfcfd] px-2 py-4">
          <div
            className="relative"
            style={{
              height: `${boardHeight}px`
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 grid"
              style={{ gridTemplateColumns: gridColumnTemplate }}
            >
              {gridTicks.slice(0, -1).map((tick, index) => (
                <div
                  key={`grid-cell-${tick}`}
                  className={
                    index > 0
                      ? isFullHour(tick)
                        ? "border-l border-[var(--color-outline-soft)]"
                        : "border-l border-[var(--color-outline-soft)]/55"
                      : ""
                  }
                />
              ))}
            </div>

            {currentTime !== null ? (
              <div
                className="absolute inset-y-0 z-10 w-px bg-[#ba1a1a]"
                style={{ left: `${currentTime}%` }}
              >
                <div className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-[#ba1a1a] shadow-[0_0_8px_rgba(186,26,26,0.45)]" />
              </div>
            ) : null}

            {Array.from({ length: laidOutBoard.laneCount }).map((_, laneIndex) => (
              <div
                key={laneIndex}
                className="absolute inset-x-0 border-b border-[var(--color-outline-soft)]/60 last:border-b-0"
                style={{
                  top: `${laneIndex * LANE_HEIGHT}px`,
                  height: `${LANE_HEIGHT}px`
                }}
              />
            ))}

            {laidOutBoard.bookings.map((booking) => {
              const left = ((booking.startMinutes - boardStartMinutes) / totalMinutes) * 100;
              const width = ((booking.endMinutes - booking.startMinutes) / totalMinutes) * 100;
              const top = booking.laneIndex * LANE_HEIGHT + 8;
              const tone =
                booking.status === "pending"
                  ? "border-[#e3cf9d] bg-[#fff8e8] text-[#76591d]"
                  : "border-[var(--color-primary)] bg-[var(--color-primary-container)] text-white";
              const selected = booking.id === selectedBookingId;
              const alignRight = left > 54;

              return (
                <div
                  key={booking.id}
                  className={`group absolute ${selected ? "z-30" : "z-20"}`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    top: `${top}px`,
                    height: `${BLOCK_HEIGHT}px`
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectBooking(booking)}
                    className={`h-full w-full overflow-hidden rounded-lg border-l-4 px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      selected ? "ring-2 ring-[var(--color-primary)] ring-offset-2" : ""
                    } ${tone}`}
                  >
                    <p className="truncate text-xs font-semibold">
                      {booking.customerName} · {booking.guestCount}p
                    </p>
                  </button>

                  <div
                    className={`absolute top-full mt-3 hidden group-focus-within:block ${
                      selected ? "block" : ""
                    } ${alignRight ? "right-0" : "left-0"}`}
                  >
                    <BookingTimelinePopover booking={booking} onClose={onClearSelection} />
                  </div>
                </div>
              );
            })}

            {bookings.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[var(--color-muted)]">
                No active bookings for this day.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${tone}`} />
      <span>{label}</span>
    </div>
  );
}

function getCurrentTimeMarker(selectedDate: string, boardStart: number, boardEnd: number) {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Copenhagen",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  if (selectedDate !== today) {
    return null;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (currentMinutes < boardStart || currentMinutes > boardEnd) {
    return null;
  }

  return ((currentMinutes - boardStart) / Math.max(boardEnd - boardStart, 1)) * 100;
}
