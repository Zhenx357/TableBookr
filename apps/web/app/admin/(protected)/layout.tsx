import { ReactNode } from "react";

import { logoutAdminAction } from "@/app/admin/actions";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { BellIcon, HelpCircleIcon } from "@/components/admin/admin-shell-icons";
import { requireAdminSession } from "@/lib/admin/session";

export default async function ProtectedAdminLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-text)]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center bg-[#222629] px-0 py-4 text-white shadow-lg lg:flex">
        <div className="mb-8">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-semibold"
            title={session.user.restaurantName}
          >
            <span className="sr-only">{session.user.restaurantName}</span>
            <span aria-hidden="true">
              {getInitials(session.user.restaurantName)}
            </span>
          </div>
        </div>

        <AdminSidebarNav />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-20">
        <header className="sticky top-0 z-40 border-b border-[var(--color-outline-soft)] bg-[var(--color-page)]/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
            <div>
              <span className="text-lg font-semibold tracking-tight text-[var(--color-primary)]">
                TableBookr
              </span>
              <p className="hidden text-xs text-[var(--color-muted)] sm:block">
                {session.user.restaurantName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full p-2 text-[var(--color-muted)] transition hover:bg-white hover:text-[var(--color-text)]"
                aria-label="Help"
              >
                <HelpCircleIcon />
              </button>
              <button
                type="button"
                className="relative rounded-full p-2 text-[var(--color-muted)] transition hover:bg-white hover:text-[var(--color-text)]"
                aria-label="Notifications"
              >
                <BellIcon />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
              </button>

              <div className="hidden h-10 w-10 items-center justify-center rounded-full border-2 border-[rgba(27,67,50,0.16)] bg-white text-sm font-semibold text-[var(--color-primary)] sm:flex">
                {getInitials(session.user.name || session.user.email || "A")}
              </div>

              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="rounded-full border border-[var(--color-outline-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-[#f3f7f4]"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>

        <footer className="border-t border-[var(--color-outline-soft)] bg-white/90 px-4 py-4 text-sm text-[var(--color-muted)] sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium text-[var(--color-primary)]">TableBookr</span>
              <span>© {new Date().getFullYear()} TableBookr Hospitality Systems</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button type="button" className="underline decoration-[var(--color-outline-soft)] underline-offset-4">
                Privacy Policy
              </button>
              <button type="button" className="underline decoration-[var(--color-outline-soft)] underline-offset-4">
                Terms of Service
              </button>
              <button type="button" className="underline decoration-[var(--color-outline-soft)] underline-offset-4">
                API Docs
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
