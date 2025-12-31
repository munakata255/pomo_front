export type Phase = "work" | "break" | "longBreak";

export interface TimerSet {
  _id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  longBreakDuration?: number;
  cycles: number;
  userId: string;
}
