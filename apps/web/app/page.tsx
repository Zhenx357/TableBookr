import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-stone-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
          TableBookr
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-stone-900">
          Public booking frontend
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Open the sample booking page for the seeded restaurant to test the Phase 3 flow.
        </p>
        <Link
          href="/book/harbor-table"
          className="mt-8 inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          Open sample booking page
        </Link>
      </div>
    </main>
  );
}
