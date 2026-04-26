"use client";

import {
  addTransitionType,
  FormEvent,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  ViewTransition
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { ApiError, createBooking, fetchAvailability } from "@/lib/api/public-booking";
import {
  AvailabilitySlot,
  BookingDateOption,
  PublicRestaurantResponse
} from "@/lib/types/public-booking";

import { BookingFlowShell } from "./booking-flow-shell";
import { HelpIcon } from "./booking-flow-icons";
import {
  BookingResultState,
  BookingSummaryItem,
  ContactErrors,
  ContactValues
} from "./booking-flow-types";
import { StepOneReservation } from "./step-one-reservation";
import { StepTwoContact } from "./step-two-contact";

function formatSpecificDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric"
  }).format(date);
}

function formatCompactSummaryDate(value: string, timeZone: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

function getInitialSelectedSlot(slots: AvailabilitySlot[]) {
  return (
    slots.find((slot) => slot.time === "18:30" && slot.status !== "blocked") ??
    slots.find((slot) => slot.time === "19:00" && slot.status !== "blocked") ??
    slots.find((slot) => slot.status !== "blocked") ??
    null
  );
}

function getAvailabilityCacheKey(date: string, guestCount: number) {
  return `${date}:${guestCount}`;
}

function areSlotsEqual(left: AvailabilitySlot[], right: AvailabilitySlot[]) {
  return (
    left.length === right.length &&
    left.every(
      (slot, index) =>
        slot.time === right[index]?.time && slot.status === right[index]?.status
    )
  );
}

function getSlotButtonClasses(status: AvailabilitySlot["status"], isSelected: boolean) {
  if (status === "blocked") {
    return "cursor-not-allowed border-[#d7ddd8] bg-[#f3f3f6] text-[#a1a7a2]";
  }

  if (status === "pending") {
    return isSelected
      ? "border-[#9e7a2a] bg-[#f7f0dc] text-[#6e5418] shadow-sm"
      : "border-[#d9c79b] bg-[#fffaf0] text-[#6e5418] hover:border-[#b38a36]";
  }

  return isSelected
    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md"
    : "border-[var(--color-outline-soft)] bg-white text-[var(--color-text)] hover:border-[#274e3d]";
}

function runBookingStepTransition(type: "booking-back" | "booking-forward", update: () => void) {
  startTransition(() => {
    addTransitionType(type);
    update();
  });
}

export function BookingPageClient({
  restaurant,
  dateOptions,
  initialDate,
  initialSlots,
  initialGuestCount,
  initialSelectedTime,
  initialIsReady
}: {
  restaurant: PublicRestaurantResponse;
  dateOptions: BookingDateOption[];
  initialDate: string;
  initialSlots: AvailabilitySlot[];
  initialGuestCount: number;
  initialSelectedTime: string | null;
  initialIsReady: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [guestCount, setGuestCount] = useState(initialGuestCount);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [slots, setSlots] = useState(initialSlots);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    initialSelectedTime
      ? initialSlots.find(
          (slot) => slot.time === initialSelectedTime && slot.status !== "blocked"
        ) ?? getInitialSelectedSlot(initialSlots)
      : getInitialSelectedSlot(initialSlots)
  );
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [stepReady, setStepReady] = useState(initialIsReady);
  const [contactValues, setContactValues] = useState<ContactValues>({
    name: "",
    email: "",
    phone: ""
  });
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResultState | null>(null);
  const hasSkippedInitialFetch = useRef(false);
  const selectedSlotRef = useRef<AvailabilitySlot | null>(selectedSlot);
  const availabilityCacheRef = useRef(
    new Map<string, AvailabilitySlot[]>([
      [getAvailabilityCacheKey(initialDate, initialGuestCount), initialSlots]
    ])
  );
  const dateInputRef = useRef<HTMLInputElement>(null);
  const quickDateValues = useMemo(
    () => new Set(dateOptions.map((option) => option.value)),
    [dateOptions]
  );
  const selectedDateIsSpecific = !quickDateValues.has(selectedDate);
  const contactStepActive = stepReady && !!selectedSlot;
  const primaryCtaLabel =
    selectedSlot?.status === "pending" ? "Send booking request" : "Confirm booking";

  useEffect(() => {
    selectedSlotRef.current = selectedSlot;
  }, [selectedSlot]);

  useEffect(() => {
    if (!hasSkippedInitialFetch.current) {
      hasSkippedInitialFetch.current = true;
      return;
    }

    let isCancelled = false;

    function applyAvailability(nextSlots: AvailabilitySlot[]) {
      const preferredTime = selectedSlotRef.current?.time ?? null;

      setSlots((currentSlots) =>
        areSlotsEqual(currentSlots, nextSlots) ? currentSlots : nextSlots
      );
      setSelectedSlot((currentSelectedSlot) => {
        if (preferredTime) {
          const matchingSlot = nextSlots.find(
            (slot) => slot.time === preferredTime && slot.status !== "blocked"
          );

          if (matchingSlot) {
            if (
              currentSelectedSlot?.time === matchingSlot.time &&
              currentSelectedSlot.status === matchingSlot.status
            ) {
              return currentSelectedSlot;
            }

            return matchingSlot;
          }
        }

        return getInitialSelectedSlot(nextSlots);
      });
      setStepReady(false);
      setBookingResult(null);
    }

    async function loadAvailability() {
      setAvailabilityError(null);

      const cacheKey = getAvailabilityCacheKey(selectedDate, guestCount);
      const cachedSlots = availabilityCacheRef.current.get(cacheKey);

      if (cachedSlots) {
        applyAvailability(cachedSlots);
        return;
      }

      setIsLoadingSlots(true);

      try {
        const response = await fetchAvailability(restaurant.slug, {
          date: selectedDate,
          guestCount
        });

        if (!isCancelled) {
          availabilityCacheRef.current.set(cacheKey, response.slots);
          applyAvailability(response.slots);
        }
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Unable to load booking times right now.";

          setSlots([]);
          setSelectedSlot(null);
          setAvailabilityError(message);
          setStepReady(false);
          setBookingResult(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSlots(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      isCancelled = true;
    };
  }, [guestCount, restaurant.slug, selectedDate]);

  function syncStepQuery(nextSelection: {
    guestCount: number;
    date: string;
    time?: string | null;
    ready?: boolean;
  }) {
    const searchParams = new URLSearchParams();

    searchParams.set("guests", String(nextSelection.guestCount));
    searchParams.set("date", nextSelection.date);

    if (nextSelection.time) {
      searchParams.set("time", nextSelection.time);
    }

    if (nextSelection.ready) {
      searchParams.set("ready", "1");
    }

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  }

  function handleGuestChange(value: number) {
    setGuestCount(value);
    setStepReady(false);
    setBookingResult(null);
    setSubmissionError(null);
  }

  function handleDateChange(value: string) {
    setSelectedDate(value);
    setStepReady(false);
    setBookingResult(null);
    setSubmissionError(null);
  }

  function handleSpecificDateClick() {
    const input = dateInputRef.current;

    if (!input) {
      return;
    }

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  }

  function handleSelectSlot(slot: AvailabilitySlot) {
    setSelectedSlot(slot);
    setStepReady(false);
    setBookingResult(null);
  }

  function handleContinueToContact() {
    if (!selectedSlot || selectedSlot.status === "blocked") {
      return;
    }

    runBookingStepTransition("booking-forward", () => {
      setStepReady(true);
      setBookingResult(null);
      syncStepQuery({
        guestCount,
        date: selectedDate,
        time: selectedSlot.time,
        ready: true
      });
    });
  }

  function handleContactValueChange(field: keyof ContactValues, value: string) {
    setContactValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));
    setContactErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined
    }));
    setSubmissionError(null);
  }

  function validateContactValues() {
    const nextErrors: ContactErrors = {};

    if (!contactValues.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!contactValues.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValues.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!contactValues.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    setContactErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSlot || !validateContactValues()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await createBooking(restaurant.slug, {
        guestCount,
        date: selectedDate,
        time: selectedSlot.time,
        name: contactValues.name.trim(),
        email: contactValues.email.trim(),
        phone: contactValues.phone.trim()
      });

      setBookingResult(response);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to complete your booking right now.";

      setSubmissionError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackToDetails() {
    runBookingStepTransition("booking-back", () => {
      setStepReady(false);
      setBookingResult(null);
      setSubmissionError(null);
      syncStepQuery({
        guestCount,
        date: selectedDate,
        time: selectedSlot?.time ?? null
      });
    });
  }

  function handleResetAfterResult() {
    runBookingStepTransition("booking-back", () => {
      setBookingResult(null);
      setSubmissionError(null);
      setStepReady(false);
      syncStepQuery({
        guestCount,
        date: selectedDate,
        time: selectedSlot?.time ?? null
      });
    });
  }

  const summaryItems: BookingSummaryItem[] = selectedSlot
    ? [
        {
          kind: "date",
          label: formatCompactSummaryDate(selectedDate, restaurant.timezone)
        },
        {
          kind: "time",
          label: selectedSlot.time
        },
        {
          kind: "guests",
          label: `${guestCount} Guest${guestCount === 1 ? "" : "s"}`
        }
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-page)] text-[var(--color-text)]">
      <header className="fixed top-0 z-50 w-full border-b border-[#eef2ef] bg-white shadow-[0_1px_8px_rgba(148,163,184,0.12)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="text-[12px] font-bold uppercase tracking-[0.26em] text-[#0f2e20]"
          >
            {restaurant.name}
          </a>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#66707a] transition-colors hover:text-[#1f3f31]"
          >
            <HelpIcon />
            <span className="hidden md:inline">Help</span>
          </button>
        </div>
      </header>

      <main
        className={`mt-8 flex flex-grow flex-col items-center px-6 pb-24 ${
          contactStepActive ? "justify-start py-12" : "justify-start pt-12"
        }`}
      >
        <ViewTransition
          default={{
            default: "none",
            "booking-back": "slide-back",
            "booking-forward": "slide-forward"
          }}
        >
          <div className="mb-4 w-full max-w-3xl text-center">
            <h1 className="mb-2 text-[32px] font-semibold tracking-[-0.02em] text-[var(--color-primary)]">
              Book Your Table
            </h1>
          </div>

          {contactStepActive ? (
            <BookingFlowShell
              activeStep={2}
              headerAction={
                <button
                  type="button"
                  onClick={handleBackToDetails}
                  className="inline-flex items-center text-[11px] font-normal text-[#7d8781] transition-colors hover:text-[var(--color-primary)]"
                >
                  <span>{"<- Back"}</span>
                </button>
              }
            >
              <StepTwoContact
                bookingResult={bookingResult}
                summaryItems={summaryItems}
                contactValues={contactValues}
                contactErrors={contactErrors}
                submissionError={submissionError}
                isSubmitting={isSubmitting}
                primaryCtaLabel={primaryCtaLabel}
                onSubmit={handleSubmitBooking}
                onBack={handleBackToDetails}
                onResetAfterResult={handleResetAfterResult}
                onContactValueChange={handleContactValueChange}
              />
            </BookingFlowShell>
          ) : (
            <BookingFlowShell activeStep={1}>
              <StepOneReservation
                guestCount={guestCount}
                selectedDate={selectedDate}
                selectedDateIsSpecific={selectedDateIsSpecific}
                dateOptions={dateOptions}
                slots={slots}
                selectedSlot={selectedSlot}
                availabilityError={availabilityError}
                isLoadingSlots={isLoadingSlots}
                dateInputRef={dateInputRef}
                formatSpecificDate={formatSpecificDate}
                getSlotButtonClasses={getSlotButtonClasses}
                onGuestChange={handleGuestChange}
                onDateChange={handleDateChange}
                onSpecificDateClick={handleSpecificDateClick}
                onSelectSlot={handleSelectSlot}
                onContinue={handleContinueToContact}
              />
            </BookingFlowShell>
          )}
        </ViewTransition>
      </main>

      <footer className="mt-auto w-full border-t border-[#eef2ef] bg-white text-sm text-[#6b7280]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-8 py-10 md:flex-row">
          <div className="text-lg font-bold text-[#0f2e20]">{restaurant.name}</div>

          <div className="flex flex-wrap justify-center gap-6 text-[12px]">
            <a href="#" className="transition-colors hover:text-[#1f3f31]">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#1f3f31]">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-[#1f3f31]">
              Contact Us
            </a>
          </div>

          <div className="text-[12px]">© 2024 {restaurant.name}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
