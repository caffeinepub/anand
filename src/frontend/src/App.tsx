import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Loader2,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import type { ScheduleEntry } from "@/backend.d";
import { EntryFormDialog } from "@/components/EntryFormDialog";
import { ScheduleEntryCard } from "@/components/ScheduleEntryCard";
import { TimelineView } from "@/components/TimelineView";
import {
  useAddEntry,
  useDeleteEntry,
  useGetAllEntries,
  useUpdateEntry,
} from "@/hooks/useQueries";
import { SUBJECTS, SUBJECT_COLORS, sortEntriesByTime } from "@/utils/schedule";
import type { SubjectName } from "@/utils/schedule";

type FilterTab = "All" | SubjectName;

const FILTER_TABS: FilterTab[] = ["All", ...SUBJECTS];

export default function App() {
  const [addOpen, setAddOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<ScheduleEntry | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const { data: allEntries = [], isLoading, isError } = useGetAllEntries();
  const addMutation = useAddEntry();
  const updateMutation = useUpdateEntry();
  const deleteMutation = useDeleteEntry();

  // Filter entries
  const filteredEntries =
    activeFilter === "All"
      ? allEntries
      : allEntries.filter((e) => e.subject === activeFilter);

  const sortedEntries = sortEntriesByTime(filteredEntries);

  async function handleAdd(data: {
    subject: string;
    startTime: string;
    endTime: string;
    note: string | null;
  }) {
    try {
      await addMutation.mutateAsync(data);
      toast.success("Schedule entry added!");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add entry. Please try again.");
    }
  }

  async function handleEdit(data: {
    subject: string;
    startTime: string;
    endTime: string;
    note: string | null;
  }) {
    if (!editEntry) return;
    try {
      await updateMutation.mutateAsync({ id: editEntry.id, ...data });
      toast.success("Entry updated!");
      setEditEntry(null);
    } catch {
      toast.error("Failed to update entry. Please try again.");
    }
  }

  async function handleDelete() {
    if (deleteId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Entry deleted.");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete entry.");
    }
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" />

      {/* ===== HEADER ===== */}
      <header
        data-ocid="header.section"
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.26 0.06 220), oklch(0.20 0.04 240))",
        }}
      >
        {/* Decorative lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, oklch(0.98 0 0) 0px, oklch(0.98 0 0) 1px, transparent 1px, transparent 60px)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              <img
                src="/assets/generated/anand-logo-transparent.dim_120x120.png"
                alt="Anand Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white tracking-tight leading-none">
                Anand
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(0.8 0.06 65)" }}
              >
                Daily Subject Timetable &mdash; 4:00 AM to 5:00 PM
              </p>
            </div>
            <div className="ml-auto">
              <Button
                onClick={() => setAddOpen(true)}
                data-ocid="add_entry.open_modal_button"
                className="font-heading font-semibold shadow-lg"
                style={{
                  background: "oklch(0.75 0.16 65)",
                  color: "oklch(0.15 0 0)",
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Entry
              </Button>
            </div>
          </motion.div>

          {/* Subject legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex flex-wrap gap-3 mt-5"
          >
            {SUBJECTS.map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${SUBJECT_COLORS[s as SubjectName].dotClass}`}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.82 0.03 200)" }}
                >
                  {s}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* Timeline visual */}
        {!isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TimelineView entries={allEntries} />
          </motion.div>
        )}

        {/* Filter tabs */}
        <section>
          <Tabs
            value={activeFilter}
            onValueChange={(v) => setActiveFilter(v as FilterTab)}
          >
            <TabsList
              className="h-auto flex flex-wrap gap-1 bg-secondary/60 p-1 rounded-xl"
              data-ocid="filter.tab"
            >
              {FILTER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="text-xs font-heading font-semibold px-3 py-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-ocid="filter.tab"
                >
                  {tab === "All" ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3" /> All
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${SUBJECT_COLORS[tab as SubjectName].dotClass}`}
                      />
                      {tab}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </section>

        {/* Schedule list */}
        <section aria-label="Schedule entries" data-ocid="schedule.list">
          {isLoading && (
            <div
              className="space-y-3"
              data-ocid="schedule.loading_state"
              aria-live="polite"
            >
              {["s1", "s2", "s3", "s4"].map((k) => (
                <Skeleton key={k} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          )}

          {isError && (
            <div
              data-ocid="schedule.error_state"
              className="flex flex-col items-center justify-center py-12 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">
                  Failed to load schedule
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please refresh the page to try again.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && sortedEntries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="schedule.empty_state"
              className="flex flex-col items-center justify-center py-16 text-center space-y-4"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.92 0.03 220)" }}
              >
                <BookOpen
                  className="w-8 h-8"
                  style={{ color: "oklch(0.45 0.1 220)" }}
                />
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-foreground">
                  {activeFilter === "All"
                    ? "No schedule entries yet"
                    : `No entries for ${activeFilter}`}
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  {activeFilter === "All"
                    ? "Start building your timetable by adding your first subject entry."
                    : `No ${activeFilter} sessions scheduled. Add one to get started.`}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setAddOpen(true)}
                className="mt-2"
                data-ocid="add_entry.open_modal_button"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Entry
              </Button>
            </motion.div>
          )}

          {!isLoading && !isError && sortedEntries.length > 0 && (
            <AnimatePresence mode="popLayout">
              <motion.div className="space-y-2.5">
                {sortedEntries.map((entry, idx) => (
                  <ScheduleEntryCard
                    key={entry.id.toString()}
                    entry={entry}
                    index={idx}
                    onEdit={setEditEntry}
                    onDelete={(id) => setDeleteId(id)}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border py-5 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear}. Built with{" "}
          <span className="text-destructive">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* ===== ADD DIALOG ===== */}
      <EntryFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        isSubmitting={addMutation.isPending}
        mode="add"
      />

      {/* ===== EDIT DIALOG ===== */}
      <EntryFormDialog
        open={!!editEntry}
        onClose={() => setEditEntry(null)}
        onSubmit={handleEdit}
        isSubmitting={updateMutation.isPending}
        editEntry={editEntry}
        mode="edit"
      />

      {/* ===== DELETE CONFIRM ===== */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="entry.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The schedule entry will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteId(null)}
              data-ocid="entry.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="entry.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
