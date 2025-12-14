import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";
import { useTimerContext } from "../contexts/TimerContext";

export default function Home() {
  const { selectedTask, selectedTimerSet, setSelectedTask, setSelectedTimerSet } =
    useTimerContext();

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
      <h1>Pomodoro Timer</h1>

      {/* タスク選択 */}
      <TaskSelect
        selectedTask={selectedTask}
        onSelectTask={setSelectedTask}
      />

      {/* タイマーセット選択 */}
      <TimerSetSelect
        selectedTimerSetId={selectedTimerSet?._id || ""}
        onSelectTimerSet={setSelectedTimerSet}
      />

      {/* タイマー表示 */}
      <Timer />
    </div>
  );
}
