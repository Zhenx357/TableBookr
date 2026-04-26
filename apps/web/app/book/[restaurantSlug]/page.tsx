import { notFound } from "next/navigation";

import { BookingPageClient } from "@/components/booking/booking-page-client";
import { ApiError, fetchAvailability, fetchPublicRestaurant } from "@/lib/api/public-booking";
import {
  AvailabilitySlot,
  BookingDateOption
} from "@/lib/types/public-booking";

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getTodayDateInTimeZone(timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(new Date());

  return toIsoDate(
    Number(parts.find((part) => part.type === "year")?.value),
    Number(parts.find((part) => part.type === "month")?.value),
    Number(parts.find((part) => part.type === "day")?.value)
  );
}

function addDays(dateString: string, days: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + days);

  return toIsoDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate()
  );
}

function buildDateOptions(timeZone: string): BookingDateOption[] {
  const today = getTodayDateInTimeZone(timeZone);
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short"
  });

  return Array.from({ length: 7 }, (_, index) => {
    const value = addDays(today, index);
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return {
      value,
      label: weekdayFormatter.format(date).toUpperCase(),
      dayNumber: String(day)
    };
  });
}

async function getInitialStepOneState(restaurantSlug: string, timeZone: string) {
  const guestCount = 1;
  const dateOptions = buildDateOptions(timeZone);
  const preferredDates = [
    dateOptions[1],
    dateOptions[0],
    ...dateOptions.slice(2)
  ].filter((option): option is BookingDateOption => Boolean(option));

  let selectedDate = dateOptions[0]?.value ?? getTodayDateInTimeZone(timeZone);
  let initialSlots: AvailabilitySlot[] = [];

  for (const option of preferredDates) {
    const response = await fetchAvailability(restaurantSlug, {
      date: option.value,
      guestCount
    });

    if (response.slots.length > 0) {
      selectedDate = option.value;
      initialSlots = response.slots;
      break;
    }
  }

  if (initialSlots.length === 0 && dateOptions[0]) {
    const fallbackResponse = await fetchAvailability(restaurantSlug, {
      date: dateOptions[0].value,
      guestCount
    });

    selectedDate = dateOptions[0].value;
    initialSlots = fallbackResponse.slots;
  }

  return {
    dateOptions,
    initialDate: selectedDate,
    initialGuestCount: guestCount,
    initialSlots
  };
}

function parseGuestCount(value: string | string[] | undefined, fallback: number) {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1 || parsedValue > 16) {
    return fallback;
  }

  return parsedValue;
}

function parseDate(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function parseTime(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  return /^\d{2}:\d{2}$/.test(value) ? value : null;
}

function pickInitialSelectedSlot(
  slots: AvailabilitySlot[],
  requestedTime: string | null
) {
  if (requestedTime) {
    const requestedSlot = slots.find(
      (slot) => slot.time === requestedTime && slot.status !== "blocked"
    );

    if (requestedSlot) {
      return requestedSlot;
    }
  }

  return (
    slots.find((slot) => slot.time === "19:00" && slot.status !== "blocked") ??
    slots.find((slot) => slot.status !== "blocked") ??
    null
  );
}

export default async function BookingPage({
  params,
  searchParams
}: {
  params: Promise<{ restaurantSlug: string }>;
  searchParams: Promise<{
    guests?: string;
    date?: string;
    time?: string;
    ready?: string;
  }>;
}) {
  const { restaurantSlug } = await params;
  const resolvedSearchParams = await searchParams;

  try {
    const restaurant = await fetchPublicRestaurant(restaurantSlug);
    const initialStepOneState = await getInitialStepOneState(
      restaurant.slug,
      restaurant.timezone
    );
    const requestedGuestCount = parseGuestCount(
      resolvedSearchParams.guests,
      initialStepOneState.initialGuestCount
    );
    const requestedDate = parseDate(resolvedSearchParams.date);
    const requestedTime = parseTime(resolvedSearchParams.time);
    const shouldUseRequestedDate =
      requestedDate &&
      initialStepOneState.dateOptions.some((option) => option.value === requestedDate);

    let initialDate = shouldUseRequestedDate
      ? requestedDate
      : initialStepOneState.initialDate;
    let initialSlots = initialStepOneState.initialSlots;

    if (
      requestedGuestCount !== initialStepOneState.initialGuestCount ||
      initialDate !== initialStepOneState.initialDate
    ) {
      const response = await fetchAvailability(restaurant.slug, {
        date: initialDate,
        guestCount: requestedGuestCount
      });

      initialSlots = response.slots;
    }

    const initialSelectedSlot = pickInitialSelectedSlot(initialSlots, requestedTime);

    return (
      <BookingPageClient
        restaurant={restaurant}
        dateOptions={initialStepOneState.dateOptions}
        initialDate={initialDate}
        initialSlots={initialSlots}
        initialGuestCount={requestedGuestCount}
        initialSelectedTime={initialSelectedSlot?.time ?? null}
        initialIsReady={resolvedSearchParams.ready === "1"}
      />
    );
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-[var(--color-page)] px-6 py-16">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <div className="w-full rounded-[24px] border border-[var(--color-error-soft)] bg-white p-10 shadow-[0_22px_60px_-38px_rgba(26,28,30,0.35)]">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-error-strong)]">
              Booking page
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-[var(--color-text)]">
              Unable to load restaurant details
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--color-muted)]">
              Please try again later or check that the restaurant URL is correct.
            </p>
          </div>
        </div>
      </main>
    );
  }
}
