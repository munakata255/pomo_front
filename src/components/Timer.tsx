import axios from "axios";
import { useTimer } from "../hooks/useTimer";
import { useState } from "react";

type Props = {
  selectedTask: string;
  selectedTimerSet: string;
  initialTime: number; // ← Home側から渡す
};

export default function Timer({
  selectedTask,
  selectedTimerSet,
  initialTime,
}: Props) {
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const handleFinish = async () => {
    if (!startedAt) return;

    alert("ポモドーロ終了！");

    try {
      await axios.post("http://localhost:5001/studyLogs", {
        userId: "testuser",
        taskId: selectedTask,
        timerSetId: selectedTimerSet,
        startedAt, // ← 修正ポイント！
        finishedAt: new Date(),
        durationSeconds: initialTime - timeLeft,
        status: "completed",
      });

      alert("保存完了しました🔥");
    } catch (error) {
      alert("保存に失敗しました");
    }

    setStartedAt(null);
  };

  const handleStart = () => {
    setStartedAt(new Date()); // ← 開始時刻を保存
    start(); // ← タイマー開始
  };
  const handleStop = () => {
    stop(); // ← 保存しない
  };
  const handleReset = () => {
    reset(); // ← useTimer の reset（時間を初期値に戻す）
    setStartedAt(null); // ← これが超重要！
  };

  
  const { timeLeft, isRunning, start, stop, reset } = useTimer(
    initialTime,
    handleFinish
  );

  // 秒 → mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!startedAt) {
      alert("まだ開始されていません");
      return;
    }

    const finishedAt = new Date();
    const durationSeconds = initialTime - timeLeft;

    try {
      await axios.post("http://localhost:5001/studyLogs", {
        userId: "testuser",
        taskId: selectedTask,
        timerSetId: selectedTimerSet,
        startedAt,
        finishedAt,
        durationSeconds,
        status: "interrupted",
      });

      alert("途中までの勉強時間を保存しました✨");
    } catch (e) {
      alert("保存に失敗しました");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "48px", marginBottom: "20px" }}>
        {formatTime(timeLeft)}
      </h2>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handleStop} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSave} disabled={isRunning || !startedAt}>
          Save
        </button>
      </div>
    </div>
  );
}
