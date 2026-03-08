import type { ScheduleEntry } from "@/backend.d";
import {
  SUBJECT_COLORS,
  TIMELINE_HOUR_MARKS,
  TIMELINE_START_MIN,
  TIMELINE_TOTAL_MIN,
  formatDisplayTime,
  getTimelinePosition,
  getTimelineWidth,
} from "@/utils/schedule";
import type { SubjectName } from "@/utils/schedule";

interface TimelineViewProps {
  entries: ScheduleEntry[];
}

export function TimelineView({ entries }: TimelineViewProps) {
  const sortedEntries = [...entries].sort((a, b) => {
    const aMin =
      Number.parseInt(a.startTime.split(":")[0]) * 60 +
      Number.parseInt(a.startTime.split(":")[1]);
    const bMin =
      Number.parseInt(b.startTime.split(":")[0]) * 60 +
      Number.parseInt(b.startTime.split(":")[1]);
    return aMin - bMin;
  });

  return (
    <div className="bg-card rounded-xl border border-border p-5 overflow-x-auto">
      <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">
        Timeline Overview
      </h2>

      {/* Hour ruler */}
      <div className="relative mb-2">
        <div className="flex">
          {TIMELINE_HOUR_MARKS.map(({ hour, label }) => {
            const pct =
              ((hour * 60 - TIMELINE_START_MIN) / TIMELINE_TOTAL_MIN) * 100;
            return (
              <div
                key={hour}
                className="absolute flex flex-col items-center"
                style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
              >
                <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-5" /> {/* spacer for labels */}
      </div>

      {/* Grid bar */}
      <div className="relative h-2 mb-3 bg-muted rounded-full overflow-hidden">
        {TIMELINE_HOUR_MARKS.map(({ hour }) => {
          const pct =
            ((hour * 60 - TIMELINE_START_MIN) / TIMELINE_TOTAL_MIN) * 100;
          return (
            <div
              key={hour}
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${pct}%` }}
            />
          );
        })}
      </div>

      {/* Entry rows stacked */}
      <div className="relative min-h-[40px] space-y-1.5">
        {sortedEntries.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4">
            No entries to display on timeline
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const subjectKey = entry.subject as SubjectName;
            const color = SUBJECT_COLORS[subjectKey] ?? SUBJECT_COLORS.AI;
            const leftPct = getTimelinePosition(entry.startTime);
            const widthPct = getTimelineWidth(entry.startTime, entry.endTime);

            return (
              <div key={entry.id.toString()} className="relative h-8">
                <div
                  className="absolute inset-y-0 rounded flex items-center px-2 overflow-hidden cursor-default group"
                  style={{
                    left: `${leftPct}%`,
                    width: `${Math.max(widthPct, 1.5)}%`,
                    backgroundColor: `${color.hex}20`,
                    borderLeft: `3px solid ${color.hex}`,
                  }}
                  title={`${entry.subject}: ${formatDisplayTime(entry.startTime)} – ${formatDisplayTime(entry.endTime)}`}
                >
                  <span
                    className="text-[11px] font-semibold font-heading truncate"
                    style={{ color: color.hex }}
                  >
                    {entry.subject}
                  </span>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-0 mb-1 bg-foreground text-background text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {entry.subject}: {formatDisplayTime(entry.startTime)} –{" "}
                    {formatDisplayTime(entry.endTime)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
