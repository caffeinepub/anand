import type { ScheduleEntry } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { SUBJECT_COLORS, formatDisplayTime } from "@/utils/schedule";
import type { SubjectName } from "@/utils/schedule";
import { Clock, Pencil, StickyNote, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface ScheduleEntryCardProps {
  entry: ScheduleEntry;
  index: number;
  onEdit: (entry: ScheduleEntry) => void;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
}

export function ScheduleEntryCard({
  entry,
  index,
  onEdit,
  onDelete,
  isDeleting,
}: ScheduleEntryCardProps) {
  const subjectKey = entry.subject as SubjectName;
  const color = SUBJECT_COLORS[subjectKey] ?? SUBJECT_COLORS.AI;
  const ocidIndex = index + 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      data-ocid={`schedule.item.${ocidIndex}`}
      className={`rounded-lg px-4 py-3.5 flex items-start justify-between gap-3 group ${color.className} transition-all`}
    >
      <div className="flex-1 min-w-0">
        {/* Subject badge */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${color.dotClass}`}
          />
          <span className="font-heading font-semibold text-sm tracking-wide uppercase">
            {entry.subject}
          </span>
        </div>

        {/* Time range */}
        <div className="flex items-center gap-1.5 text-xs opacity-80 mb-1">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>
            {formatDisplayTime(entry.startTime)} –{" "}
            {formatDisplayTime(entry.endTime)}
          </span>
        </div>

        {/* Note */}
        {entry.note && (
          <div className="flex items-start gap-1.5 text-xs opacity-70 mt-1.5">
            <StickyNote className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{entry.note}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-black/10"
          onClick={() => onEdit(entry)}
          data-ocid={`entry.edit_button.${ocidIndex}`}
          title="Edit entry"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-destructive/15 hover:text-destructive"
          onClick={() => onDelete(entry.id)}
          disabled={isDeleting}
          data-ocid={`entry.delete_button.${ocidIndex}`}
          title="Delete entry"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
