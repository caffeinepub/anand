import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScheduleEntry {
    id: bigint;
    startTime: string;
    subject: Subject;
    endTime: string;
    note?: string;
}
export enum Subject {
    AI = "AI",
    Computer = "Computer",
    Maths = "Maths",
    Commerce = "Commerce"
}
export interface backendInterface {
    addScheduleEntry(subjectText: string, startTime: string, endTime: string, note: string | null): Promise<ScheduleEntry>;
    deleteScheduleEntry(id: bigint): Promise<void>;
    getAllScheduleEntries(): Promise<Array<ScheduleEntry>>;
    getEntriesBySubject(subjectText: string): Promise<Array<ScheduleEntry>>;
    updateScheduleEntry(id: bigint, subjectText: string, startTime: string, endTime: string, note: string | null): Promise<void>;
}
