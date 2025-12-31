import type { TimerSet, Phase } from "./timer";

export interface AuthContextType {
  user: any;
  role: string | null;
}

export interface TimerContextType {
  // タイマーの状態
  timeLeft: number;
  initialTime: number;
  isRunning: boolean;
  phase: Phase;
  cycle: number;
  
  // 選択中のタスク・タイマーセット
  selectedTask: string;
  selectedTimerSet: TimerSet | null;
  
  // 操作関数
  setSelectedTask: (taskId: string) => void;
  setSelectedTimerSet: (timerSet: TimerSet | null) => void;
  start: () => void;
  stop: () => void;
  reset: () => void;
  save: () => Promise<void>;
  
  // ステータス
  hasTimerStarted: boolean;
}
