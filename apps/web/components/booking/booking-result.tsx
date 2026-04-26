import { BookingCreationStatus } from "@/lib/types/public-booking";

const RESULT_COPY: Record<BookingCreationStatus, { title: string; body: string }> = {
  confirmed: {
    title: "Booking confirmed",
    body: "Your booking is confirmed."
  },
  pending: {
    title: "Booking pending",
    body: "Your booking request was received and still needs restaurant confirmation."
  },
  blocked: {
    title: "Time unavailable",
    body: "This time is not available online. Please choose another slot or contact the restaurant."
  }
};

export function BookingResult({
  status,
  bookingId,
  onReset
}: {
  status: BookingCreationStatus;
  bookingId?: string;
  onReset: () => void;
}) {
  const copy = RESULT_COPY[status];

  return (
    <section className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
        Result
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-stone-900">{copy.title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">{copy.body}</p>
      {bookingId ? (
        <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-stone-500">
          Booking ID: <span className="font-medium text-stone-800">{bookingId}</span>
        </p>
      ) : null}
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
      >
        Make another booking
      </button>
    </section>
  );
}
