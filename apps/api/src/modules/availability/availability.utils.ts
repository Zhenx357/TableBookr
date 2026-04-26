import { BadRequestException } from "@nestjs/common";
import { DateTime } from "luxon";
import { OpeningHour, Weekday } from "@prisma/client";

const WEEKDAY_BY_LUXON: Record<number, Weekday> = {
  1: Weekday.MONDAY,
  2: Weekday.TUESDAY,
  3: Weekday.WEDNESDAY,
  4: Weekday.THURSDAY,
  5: Weekday.FRIDAY,
  6: Weekday.SATURDAY,
  7: Weekday.SUNDAY
};

export function parseIsoDate(date: string, timezone: string): DateTime {
  const parsed = DateTime.fromISO(date, { zone: timezone });

  if (!parsed.isValid || parsed.toISODate() !== date) {
    throw new BadRequestException("Date must be a valid ISO date in YYYY-MM-DD format");
  }

  return parsed.startOf("day");
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map((value) => Number(value));

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new BadRequestException("Time must be a valid HH:mm value");
  }

  return hours * 60 + minutes;
}

export function dbDateFromIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

export function dbTimeFromMinutes(totalMinutes: number): Date {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

export function dbTimeToMinutes(value: Date): number {
  return value.getUTCHours() * 60 + value.getUTCMinutes();
}

export function dbDateToIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function weekdayFromDate(date: DateTime): Weekday {
  return WEEKDAY_BY_LUXON[date.weekday];
}

export function findOpeningHoursForDate(
  openingHours: OpeningHour[],
  date: DateTime
): OpeningHour | undefined {
  const weekday = weekdayFromDate(date);
  return openingHours.find((entry) => entry.weekday === weekday);
}

export function generateStartTimes(
  openTimeMinutes: number,
  closeTimeMinutes: number,
  slotMinutes: number
): number[] {
  const startTimes: number[] = [];

  if (slotMinutes <= 0 || openTimeMinutes >= closeTimeMinutes) {
    return startTimes;
  }

  for (let current = openTimeMinutes; current < closeTimeMinutes; current += slotMinutes) {
    startTimes.push(current);
  }

  return startTimes;
}

export function meetsMinimumLeadTime(
  date: string,
  startMinutes: number,
  timezone: string,
  minimumLeadTimeMinutes: number
): boolean {
  const bookingStart = parseIsoDate(date, timezone).plus({ minutes: startMinutes });
  const earliestAllowed = DateTime.now().setZone(timezone).plus({
    minutes: minimumLeadTimeMinutes
  });

  return bookingStart.toMillis() >= earliestAllowed.toMillis();
}

export function buildAffectedSlotStarts(
  startMinutes: number,
  durationMinutes: number,
  slotMinutes: number
): number[] {
  const slotStarts: number[] = [];

  for (
    let current = startMinutes;
    current < startMinutes + durationMinutes;
    current += slotMinutes
  ) {
    slotStarts.push(current);
  }

  return slotStarts;
}

export function intervalsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}
