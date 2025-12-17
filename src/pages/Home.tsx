import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";
import { useTimerContext } from "../contexts/TimerContext";
import "./Home.css";

export default function Home() {
  const { selectedTask, selectedTimerSet, setSelectedTask, setSelectedTimerSet } =
    useTimerContext();

  return (
    <div className="home-container">
      {/* タスク選択とタイマーセット選択を横一列に */}
      <div className="selection-row">
        <div className="selection-section">
          <TaskSelect
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
          />
        </div>

        <div className="selection-section">
          <TimerSetSelect
            selectedTimerSetId={selectedTimerSet?._id || ""}
            onSelectTimerSet={setSelectedTimerSet}
          />
        </div>
      </div>

      {/* タイマー表示 */}
      <div className="timer-wrapper">
        <Timer />
      </div>

      {/* 選択情報表示 */}
      {selectedTask && selectedTimerSet && (
        <div className="selected-info">
          <p>⏱️ <strong>{selectedTimerSet.name}</strong></p>
          <p>作業: {selectedTimerSet.workDuration}分 | 休憩: {selectedTimerSet.breakDuration}分 | {selectedTimerSet.cycles}サイクル</p>
        </div>
      )}
    </div>
  );
}
