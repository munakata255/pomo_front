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
