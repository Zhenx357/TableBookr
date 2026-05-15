"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AddIcon,
  AnalyticsIcon,
  BookingsIcon,
  DashboardIcon,
  SettingsIcon,
  SupportIcon
} from "./admin-shell-icons";

type NavItem = {
  href?: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const PRIMARY_ITEMS: NavItem[] = [
  { href: "/admin/bookings/day", label: "Day Board", icon: DashboardIcon },
  { href: "/admin/bookings", label: "Bookings", icon: BookingsIcon },
  { label: "Settings", icon: SettingsIcon }
];

const SECONDARY_ITEMS: NavItem[] = [
  { label: "Support", icon: SupportIcon },
  { label: "System Status", icon: AnalyticsIcon }
];

function isActive(pathname: string, href: string) {
  if (href === "/admin/bookings/day") {
    return pathname.startsWith("/admin/bookings/day");
  }

  if (href === "/admin/bookings") {
    return pathname.startsWith("/admin/bookings") && !pathname.startsWith("/admin/bookings/day");
  }

  return pathname === href;
}

function NavButton({
  item,
  active
}: {
  item: NavItem;
  active?: boolean;
}) {
  const Icon = item.icon;
  const sharedClassName =
    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition";
  const activeClassName = active
    ? "bg-[var(--color-primary-container)] text-[var(--color-primary-fixed)]"
    : "text-[#a3a6a9] hover:bg-white/5 hover:text-white";

  if (item.href) {
    return (
      <Link href={item.href} className={`${sharedClassName} ${activeClassName}`}>
        <Icon className="h-[18px] w-[18px]" />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`${sharedClassName} ${activeClassName} cursor-not-allowed opacity-75`}
    >
      <Icon className="h-[18px] w-[18px]" />
      <span>{item.label}</span>
    </button>
  );
}

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 space-y-1">
        {PRIMARY_ITEMS.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            active={item.href ? isActive(pathname, item.href) : false}
          />
        ))}
      </nav>

      <div className="px-4">
        <button
          type="button"
          disabled
          className="flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white opacity-75"
        >
          <AddIcon className="h-[18px] w-[18px]" />
          <span>New Booking</span>
        </button>
      </div>

      <div className="mt-auto border-t border-white/10 px-2 pt-4">
        {SECONDARY_ITEMS.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </div>
    </>
  );
}
