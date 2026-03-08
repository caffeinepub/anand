import type { ScheduleEntry } from "@/backend.d";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS, SUBJECT_COLORS } from "@/utils/schedule";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EntryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    subject: string;
    startTime: string;
    endTime: string;
    note: string | null;
  }) => void;
  isSubmitting: boolean;
  editEntry?: ScheduleEntry | null;
  mode: "add" | "edit";
}

export function EntryFormDialog({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  editEntry,
  mode,
}: EntryFormDialogProps) {
  const [subject, setSubject] = useState("AI");
  const [startTime, setStartTime] = useState("04:00");
  const [endTime, setEndTime] = useState("05:00");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editEntry && mode === "edit") {
      setSubject(editEntry.subject);
      setStartTime(editEntry.startTime);
      setEndTime(editEntry.endTime);
      setNote(editEntry.note ?? "");
    } else if (mode === "add") {
      setSubject("AI");
      setStartTime("04:00");
      setEndTime("05:00");
      setNote("");
    }
    setErrors({});
  }, [editEntry, mode]);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!subject) newErrors.subject = "Subject is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      subject,
      startTime,
      endTime,
      note: note.trim() || null,
    });
  }

  const dialogOcid = mode === "add" ? "add_entry.dialog" : "edit_entry.dialog";
  const submitOcid =
    mode === "add" ? "add_entry.submit_button" : "edit_entry.submit_button";
  const cancelOcid =
    mode === "add" ? "add_entry.cancel_button" : "edit_entry.cancel_button";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md bg-card border border-border shadow-xl"
        data-ocid={dialogOcid}
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">
            {mode === "add" ? "Add Schedule Entry" : "Edit Schedule Entry"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="subject-select" className="text-sm font-medium">
              Subject
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger
                id="subject-select"
                data-ocid="add_entry.subject.select"
                className="w-full"
              >
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${SUBJECT_COLORS[s].dotClass}`}
                      />
                      {s}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p
                className="text-xs text-destructive"
                data-ocid="add_entry.subject.error_state"
              >
                {errors.subject}
              </p>
            )}
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="start-time" className="text-sm font-medium">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                min="04:00"
                max="17:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                data-ocid="add_entry.start_time.input"
                className="w-full"
              />
              {errors.startTime && (
                <p className="text-xs text-destructive">{errors.startTime}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end-time" className="text-sm font-medium">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                min="04:00"
                max="17:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                data-ocid="add_entry.end_time.input"
                className="w-full"
              />
              {errors.endTime && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="add_entry.end_time.error_state"
                >
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-sm font-medium">
              Note{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="note"
              placeholder="Any additional notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              data-ocid="add_entry.note.textarea"
              rows={3}
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              data-ocid={cancelOcid}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-ocid={submitOcid}
              className="bg-primary text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "add" ? (
                "Add Entry"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
