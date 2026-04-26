import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-stone-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
          Booking page
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-stone-900">Restaurant not found</h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          The requested booking page could not be found.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
