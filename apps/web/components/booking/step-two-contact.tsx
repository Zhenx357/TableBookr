import { FormEvent } from "react";

import { BookingCreationStatus } from "@/lib/types/public-booking";

import { BookingResultState, BookingSummaryItem, ContactErrors, ContactValues } from "./booking-flow-types";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  GuestsIcon
} from "./booking-flow-icons";

function SummaryIcon({ kind }: { kind: BookingSummaryItem["kind"] }) {
  if (kind === "date") {
    return <CalendarIcon />;
  }

  if (kind === "time") {
    return <ClockIcon />;
  }

  return <GuestsIcon />;
}

function ResultTitle({ status }: { status: BookingCreationStatus }) {
  if (status === "confirmed") {
    return "Booking confirmed";
  }

  if (status === "pending") {
    return "Booking request sent";
  }

  return "Time no longer available";
}

function ResultMessage({ status }: { status: BookingCreationStatus }) {
  if (status === "confirmed") {
    return "Your reservation has been secured. We look forward to welcoming you.";
  }

  if (status === "pending") {
    return "Your request has been sent to the restaurant and still needs confirmation.";
  }

  return "This reservation is no longer available online. Please choose another time.";
}

export function StepTwoContact({
  bookingResult,
  summaryItems,
  contactValues,
  contactErrors,
  submissionError,
  isSubmitting,
  primaryCtaLabel,
  onSubmit,
  onBack,
  onResetAfterResult,
  onContactValueChange
}: {
  bookingResult: BookingResultState | null;
  summaryItems: BookingSummaryItem[];
  contactValues: ContactValues;
  contactErrors: ContactErrors;
  submissionError: string | null;
  isSubmitting: boolean;
  primaryCtaLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onResetAfterResult: () => void;
  onContactValueChange: (field: keyof ContactValues, value: string) => void;
}) {
  return (
    <div className="px-8 pb-8 pt-8">
      <div className="mx-auto max-w-[352px]">
        {bookingResult ? (
          <div className="space-y-4 py-4 text-center">
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                bookingResult.status === "blocked"
                  ? "bg-[var(--color-error-bg)] text-[var(--color-error-strong)]"
                  : "bg-[var(--color-primary-fixed)] text-[var(--color-primary)]"
              }`}
            >
              {bookingResult.status === "blocked" ? "!" : <CheckIcon />}
            </div>
            <div>
              <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-[var(--color-primary)]">
                <ResultTitle status={bookingResult.status} />
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-[var(--color-muted)]">
                <ResultMessage status={bookingResult.status} />
              </p>
            </div>
            {bookingResult.bookingId ? (
              <p className="rounded-lg border border-[var(--color-outline-soft)] bg-white px-4 py-3 text-[14px] text-[var(--color-muted)]">
                Booking ID:{" "}
                <span className="font-medium text-[var(--color-text)]">
                  {bookingResult.bookingId}
                </span>
              </p>
            ) : null}
            <div className="pt-3">
              <button
                type="button"
                onClick={onResetAfterResult}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Make another booking
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="text-center">
              <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[var(--color-primary)]">
                Contact Details
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-[var(--color-muted)]">
                Please provide your details to confirm your table.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-[rgba(193,200,194,0.3)] bg-[var(--color-surface-muted)] px-4 py-2.5">
                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium text-[var(--color-text)]">
                  {summaryItems.map((item, index) => (
                    <div key={`${item.kind}-${item.label}`} className="flex items-center gap-3">
                      {index > 0 ? (
                        <span className="text-[var(--color-outline-soft)]">•</span>
                      ) : null}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[var(--color-primary)] [&>svg]:h-4 [&>svg]:w-4">
                          <SummaryIcon kind={item.kind} />
                        </span>
                        <span>{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-[13px] font-medium text-[var(--color-text)]"
                htmlFor="contact-name"
              >
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={contactValues.name}
                onChange={(event) => onContactValueChange("name", event.target.value)}
                placeholder="Enter your full name"
                className="h-11 w-full rounded-lg border border-[var(--color-outline-soft)] bg-white px-4 text-[14px] outline-none transition-colors placeholder:text-stone-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              {contactErrors.name ? (
                <p className="text-[13px] text-[var(--color-error-strong)]">
                  {contactErrors.name}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                className="block text-[13px] font-medium text-[var(--color-text)]"
                htmlFor="contact-email"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                value={contactValues.email}
                onChange={(event) => onContactValueChange("email", event.target.value)}
                placeholder="email@example.com"
                className="h-11 w-full rounded-lg border border-[var(--color-outline-soft)] bg-white px-4 text-[14px] outline-none transition-colors placeholder:text-stone-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              {contactErrors.email ? (
                <p className="text-[13px] text-[var(--color-error-strong)]">
                  {contactErrors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                className="block text-[13px] font-medium text-[var(--color-text)]"
                htmlFor="contact-phone"
              >
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={contactValues.phone}
                onChange={(event) => onContactValueChange("phone", event.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-11 w-full rounded-lg border border-[var(--color-outline-soft)] bg-white px-4 text-[14px] outline-none transition-colors placeholder:text-stone-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              {contactErrors.phone ? (
                <p className="text-[13px] text-[var(--color-error-strong)]">
                  {contactErrors.phone}
                </p>
              ) : null}
            </div>

            {submissionError ? (
              <div className="rounded-lg border border-[var(--color-error-soft)] bg-[var(--color-error-bg)] px-4 py-3 text-[14px] text-[var(--color-error-strong)]">
                {submissionError}
              </div>
            ) : null}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : primaryCtaLabel}
                <ArrowRightIcon />
              </button>
            </div>

            <p className="pt-0.5 text-center text-[10px] leading-5 text-[var(--color-muted)]">
              By clicking confirm, you agree to our{" "}
              <a
                href="#"
                className="underline transition-colors hover:text-[var(--color-primary)]"
              >
                Booking Terms
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
