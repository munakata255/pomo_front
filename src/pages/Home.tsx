import { useState } from "react";
import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [, setIsTimerRunning] = useState(false);
  const [hasTimerStarted, setHasTimerStarted] = useState(false);
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

  const handleTaskChange = (taskId: string) => {
    if (hasTimerStarted) {
      const confirmed = window.confirm(
        "タイマー実行中です。タスクを変更するとサイクルが最初の状態（work）にリセットされます。よろしいですか？"
      );
      if (confirmed) {
        // サイクルをリセット
        if ((window as any).__resetTimerCycle) {
          (window as any).__resetTimerCycle();
        }
        setSelectedTask(taskId);
        setHasTimerStarted(false);
      }
    } else {
      setSelectedTask(taskId);
    }
  };

  const handleTimerSetChange = (setObj: TimerSet | null) => {
    if (hasTimerStarted) {
      const confirmed = window.confirm(
        "タイマー実行中です。Timer Setを変更するとサイクルが最初の状態（work）にリセットされます。よろしいですか？"
      );
      if (confirmed) {
        // サイクルをリセット
        if ((window as any).__resetTimerCycle) {
          (window as any).__resetTimerCycle();
        }
        setSelectedTimerSet(setObj);
        setHasTimerStarted(false);
      }
    } else {
      setSelectedTimerSet(setObj);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
      <h1>Pomodoro Timer</h1>

      {/* タスク選択 */}
      <TaskSelect
        selectedTask={selectedTask}
        onSelectTask={handleTaskChange}
      />

      {/* タイマーセット選択 */}
      <TimerSetSelect
        selectedTimerSetId={selectedTimerSet?._id || ""}
        onSelectTimerSet={handleTimerSetChange}
      />

      {/* タイマー表示 */}
      <Timer
        selectedTask={selectedTask}
        selectedTimerSet={selectedTimerSet}
        initialTime={getInitialTime()}
        onAllFinished={() => {
          // 初期状態に戻す
          setSelectedTask("");
          setSelectedTimerSet(null);
          setIsTimerRunning(false);
          setHasTimerStarted(false);
        }}
        onTimerStateChange={setIsTimerRunning}
        onTimerStarted={() => setHasTimerStarted(true)}
        onTimerReset={() => setHasTimerStarted(false)}
        onResetCycle={() => {}}
      />
    </div>
  );
}
