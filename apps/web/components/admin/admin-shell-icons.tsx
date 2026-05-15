import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function Svg({
  children,
  className = "h-5 w-5"
}: IconProps & { children: ReactNode }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect
        x="13"
        y="4"
        width="7"
        height="4.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13"
        y="10.5"
        width="7"
        height="9.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="13"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </Svg>
  );
}

export function BookingsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M6 5.5h12A1.5 1.5 0 0 1 19.5 7v10A1.5 1.5 0 0 1 18 18.5H6A1.5 1.5 0 0 1 4.5 17V7A1.5 1.5 0 0 1 6 5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 3.5v4M16 3.5v4M4.5 9.5h15" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m19 12-.9.52a1 1 0 0 0-.47 1.2l.1.3a1 1 0 0 1-.24 1.04l-.6.6a1 1 0 0 1-1.03.24l-.31-.1a1 1 0 0 0-1.19.47L14 19a1 1 0 0 1-.9.58h-1.2A1 1 0 0 1 11 19l-.52-.9a1 1 0 0 0-1.2-.47l-.3.1a1 1 0 0 1-1.04-.24l-.6-.6a1 1 0 0 1-.24-1.03l.1-.31a1 1 0 0 0-.47-1.19L5 14a1 1 0 0 1-.58-.9v-1.2A1 1 0 0 1 5 11l.9-.52a1 1 0 0 0 .47-1.2l-.1-.3a1 1 0 0 1 .24-1.04l.6-.6a1 1 0 0 1 1.03-.24l.31.1a1 1 0 0 0 1.19-.47L10 5a1 1 0 0 1 .9-.58h1.2A1 1 0 0 1 13 5l.52.9a1 1 0 0 0 1.2.47l.3-.1a1 1 0 0 1 1.04.24l.6.6a1 1 0 0 1 .24 1.03l-.1.31a1 1 0 0 0 .47 1.19L19 11a1 1 0 0 1 .58.9v1.2A1 1 0 0 1 19 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AddIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function HelpCircleIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.8 9.35a2.4 2.4 0 1 1 3.14 2.28c-.73.28-1.19.96-1.19 1.74v.23"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16.7" r="0.9" fill="currentColor" />
    </Svg>
  );
}

export function SupportIcon({ className }: IconProps) {
  return <HelpCircleIcon className={className} />;
}

export function AnalyticsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 18.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M7.5 16V10.5M12 16V7.5M16.5 16V12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M9 18a3 3 0 0 0 6 0M6.5 15.5h11l-1.4-2.17a4.5 4.5 0 0 1-.7-2.42V10a3.4 3.4 0 1 0-6.8 0v.9a4.5 4.5 0 0 1-.7 2.42L6.5 15.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="m14.5 6.5-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="m9.5 6.5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4.5" y="6.5" width="15" height="11" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.5 8 5.5 4.5L17.5 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="m8.2 5.5 1.5 2.77a1 1 0 0 1-.16 1.17l-1.1 1.24a13.24 13.24 0 0 0 4.87 4.87l1.24-1.1a1 1 0 0 1 1.17-.16l2.77 1.5a1 1 0 0 1 .51.95l-.24 2.32a1 1 0 0 1-1 .89C10.85 20 4 13.15 4 4.7a1 1 0 0 1 .89-1l2.32-.24a1 1 0 0 1 .99.51Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8v4.5l3 1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GuestsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 17.5c.95-2.15 2.8-3.5 4.95-3.5s4 1.35 4.95 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.2 15.1c1.37.2 2.56 1.02 3.27 2.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
