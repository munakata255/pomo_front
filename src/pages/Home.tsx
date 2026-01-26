import { useState } from "react";
import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";
import { useTimerContext } from "../contexts/TimerContext";
import "./Home.css";

export default function Home() {
  const { selectedTask, selectedTimerSet, setSelectedTask, setSelectedTimerSet, buttonMode, isRunning, start, stop } =
    useTimerContext();
  const [isTimerHovered, setIsTimerHovered] = useState(false);

  const handleTimerWrapperClick = () => {
    if (buttonMode === "click") {
      if (isRunning) {
        stop();
      } else {
        start();
      }
    }
  };

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
      <div 
        className="timer-wrapper"
        onClick={handleTimerWrapperClick}
        onMouseEnter={() => buttonMode === "click" && setIsTimerHovered(true)}
        onMouseLeave={() => setIsTimerHovered(false)}
        style={{
          cursor: buttonMode === "click" ? "pointer" : "default",
          backgroundColor: buttonMode === "click" && isTimerHovered ? "rgba(25, 118, 210, 0.08)" : "#ffffff",
          transition: "background-color 0.2s ease",
        }}
      >
        <Timer />
      </div>

      {/* 選択情報表示 */}
      {selectedTask && selectedTimerSet && (
        <div className="selected-info">
          <p>⏱️ <strong>{selectedTimerSet.name}</strong></p>
          <p>作業: {selectedTimerSet.workDuration}分 | 休憩: {selectedTimerSet.breakDuration}分 | 長休憩: {selectedTimerSet.longBreakDuration ?? 0}分 | {selectedTimerSet.cycles}サイクル</p>
        </div>
      )}
    </div>
  );
}
