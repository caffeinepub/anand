import type { ScheduleEntry } from "../backend.d";

export const SUBJECTS = ["AI", "Commerce", "Maths", "Computer"] as const;
export type SubjectName = (typeof SUBJECTS)[number];

export const SUBJECT_COLORS: Record<
  SubjectName,
  { className: string; dotClass: string; label: string; hex: string }
> = {
  AI: {
    className: "subject-ai",
    dotClass: "subject-dot-ai",
    label: "AI",
    hex: "#c98a00",
  },
  Commerce: {
    className: "subject-commerce",
    dotClass: "subject-dot-commerce",
    label: "Commerce",
    hex: "#1a9e80",
  },
  Maths: {
    className: "subject-maths",
    dotClass: "subject-dot-maths",
    label: "Maths",
    hex: "#3366cc",
  },
  Computer: {
    className: "subject-computer",
    dotClass: "subject-dot-computer",
    label: "Computer",
    hex: "#8833cc",
  },
};

// Timeline: 4:00 AM (240 min from midnight) to 17:00 (1020 min)
export const TIMELINE_START_MIN = 4 * 60; // 240
export const TIMELINE_END_MIN = 17 * 60; // 1020
export const TIMELINE_TOTAL_MIN = TIMELINE_END_MIN - TIMELINE_START_MIN; // 780

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDisplayTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

export function getTimelinePosition(time: string): number {
  const min = timeToMinutes(time);
  const clamped = Math.max(TIMELINE_START_MIN, Math.min(TIMELINE_END_MIN, min));
  return ((clamped - TIMELINE_START_MIN) / TIMELINE_TOTAL_MIN) * 100;
}

export function getTimelineWidth(startTime: string, endTime: string): number {
  const startMin = Math.max(TIMELINE_START_MIN, timeToMinutes(startTime));
  const endMin = Math.min(TIMELINE_END_MIN, timeToMinutes(endTime));
  return ((endMin - startMin) / TIMELINE_TOTAL_MIN) * 100;
}

export function sortEntriesByTime(entries: ScheduleEntry[]): ScheduleEntry[] {
  return [...entries].sort((a, b) => {
    const aMin = timeToMinutes(a.startTime);
    const bMin = timeToMinutes(b.startTime);
    return aMin - bMin;
  });
}

export const TIMELINE_HOUR_MARKS: Array<{ hour: number; label: string }> = [];
for (let h = 4; h <= 17; h++) {
  const period = h < 12 ? "AM" : "PM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  TIMELINE_HOUR_MARKS.push({
    hour: h,
    label: `${displayH}${period}`,
  });
}
