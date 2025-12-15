// ユーザー関連
export interface DevUser {
  uid: string;
  email: string;
  displayName?: string;
}

// タスク関連
export interface Task {
  _id: string;
  name: string;
  userId: string;
}

// タイマーセット関連
export interface TimerSet {
  _id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  longBreakDuration?: number;
  cycles: number;
  userId: string;
}

// 学習ログ関連
export interface StudyLog {
  _id: string;
  userId: string;
  taskId: string;
  timerSetId: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  status: "completed" | "interrupted";
}

// 統計関連
export interface TaskSummary {
  taskId: string;
  taskName: string;
  seconds: number;
}

export interface StatsData {
  totalSeconds: number;
  logCount: number;
  taskSummary: TaskSummary[];
}

export interface ChartData {
  date: string;
  minutes: number;
}

// タイマー関連
export type Phase = "work" | "break" | "longBreak";
