import { useState } from "react";
import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedTimerSet, setSelectedTimerSet] = useState<string>("");
  const getInitialTime = () => {
    switch (selectedTimerSet) {
      case "set1":
        return 25 * 60;
      case "set2":
        return 50 * 60;
      case "set3":
        return 90 * 60;
      default:
        return 25 * 60;
    }
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
        selectedTimerSet={selectedTimerSet}
        onSelectTimerSet={(setId) => setSelectedTimerSet(setId)}
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
