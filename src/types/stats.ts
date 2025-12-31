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
