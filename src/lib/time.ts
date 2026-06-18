// Functions for timezone math
// Intl.DateTimeFormat + IANA tz database.

export function getOffsetMinutes(tz: string, at: Date = new Date()): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(at).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return Math.round((asUTC - at.getTime()) / 60000);
}

export function formatOffsetLabel(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

export function getTimeParts(tz: string, at: Date = new Date()) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const parts = dtf.formatToParts(at).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const second = Number(parts.second);
  return {
    hour,
    minute,
    second,
    weekday: parts.weekday,
    day: parts.day,
    month: parts.month,
    fractionOfDay: (hour * 3600 + minute * 60 + second) / 86400,
  };
}

export function isDaylight(fractionOfDay: number): boolean {
  // Simple civic approximation: 06:00–18:00 counts as "day" for the visual terminator strip. Good enough for an at-a-glance read, intentionally not full solar-position astronomy, it's just for visual. 
  return fractionOfDay >= 0.25 && fractionOfDay < 0.75;
}

export function shiftDate(base: Date, minutesDelta: number): Date {
  return new Date(base.getTime() + minutesDelta * 60000);
}
