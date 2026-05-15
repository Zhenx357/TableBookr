const DENMARK_TIME_ZONE = "Europe/Copenhagen";
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayInDenmarkIsoDate() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: DENMARK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

export function normalizeBoardDate(value: string | undefined) {
  if (!value || !ISO_DATE_PATTERN.test(value)) {
    return getTodayInDenmarkIsoDate();
  }

  return value;
}

export function isoDateToLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function localDateToIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDaysToIsoDate(value: string, days: number) {
  const nextDate = isoDateToLocalDate(value);
  nextDate.setDate(nextDate.getDate() + days);
  return localDateToIsoDate(nextDate);
}
