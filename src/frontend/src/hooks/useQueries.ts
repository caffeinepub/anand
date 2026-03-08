import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScheduleEntry } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<ScheduleEntry[]>({
    queryKey: ["scheduleEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScheduleEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEntriesBySubject(subject: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ScheduleEntry[]>({
    queryKey: ["scheduleEntries", "subject", subject],
    queryFn: async () => {
      if (!actor || !subject) return [];
      return actor.getEntriesBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      subject,
      startTime,
      endTime,
      note,
    }: {
      subject: string;
      startTime: string;
      endTime: string;
      note: string | null;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.addScheduleEntry(subject, startTime, endTime, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleEntries"] });
    },
  });
}

export function useUpdateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      subject,
      startTime,
      endTime,
      note,
    }: {
      id: bigint;
      subject: string;
      startTime: string;
      endTime: string;
      note: string | null;
    }) => {
      if (!actor) throw new Error("No actor available");
      return actor.updateScheduleEntry(id, subject, startTime, endTime, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleEntries"] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.deleteScheduleEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleEntries"] });
    },
  });
}
