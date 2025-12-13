import { useState } from "react";
import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<string>("");
  type TimerSet = {
    _id: string;
    name: string;
    workDuration: number;
    breakDuration: number;
    cycles: number;
  };

  // ↓ string → TimerSet | null に変更
  const [selectedTimerSet, setSelectedTimerSet] = useState<TimerSet | null>(
    null
  );
  const getInitialTime = () => {
    if (!selectedTimerSet) return 2 * 1; // デフォルト
    return selectedTimerSet.workDuration * 60;
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
      <h1>Pomodoro Timer</h1>

      {/* タスク選択 */}
      <TaskSelect
        selectedTask={selectedTask}
        onSelectTask={(taskId) => setSelectedTask(taskId)}
      />

      {/* タイマーセット選択 */}
      <TimerSetSelect
        selectedTimerSetId={selectedTimerSet?._id || ""}
        onSelectTimerSet={(setObj: TimerSet | null) => setSelectedTimerSet(setObj)}
      />

      {/* タイマー表示 */}
      <Timer
        selectedTask={selectedTask}
        selectedTimerSet={selectedTimerSet}
        initialTime={getInitialTime()}
      />
    </div>
  );
}
