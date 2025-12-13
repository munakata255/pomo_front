import axios from "axios";
import { useTimer } from "../hooks/useTimer";
import { useState, useRef } from "react";

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
  const startedAtRef = useRef<Date | null>(null);
  

  const handleFinish = async () => {
    if (!startedAtRef.current) return console.error("startedAt is null");

    alert("ポモドーロ終了！");
    console.log("Timer finished, saving log..." );

    try {
      await axios.post("http://localhost:5001/studyLogs", {
        userId: "testuser",
        taskId: selectedTask,
        timerSetId: selectedTimerSet,
        startedAt: startedAtRef.current,
        finishedAt: new Date(),
        durationSeconds: initialTime - timeLeftRef.current,
        status: "completed",
      });

      alert("保存完了しました🔥");
    } catch (error) {
      alert("保存に失敗しました");
    }
    startedAtRef.current = null;
  };

  const handleStart = () => {
    startedAtRef.current = new Date();
    start(); // ← タイマー開始
  };
  const handleStop = () => {
    stop(); // ← 保存しない
  };
  const handleReset = () => {
    reset(); // ← useTimer の reset（時間を初期値に戻す）
    startedAtRef.current = null; // ← これが超重要！
  };

  
  const { timeLeft,timeLeftRef, isRunning, start, stop, reset } = useTimer(
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
    if (!startedAtRef.current) {
      alert("まだ開始されていません");
      return;
    }

    const finishedAt = new Date();
    const durationSeconds = initialTime - timeLeftRef.current;

    try {
      await axios.post("http://localhost:5001/studyLogs", {
        userId: "testuser",
        taskId: selectedTask,
        timerSetId: selectedTimerSet,
        startedAt: startedAtRef.current,
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
        <button onClick={handleSave} disabled={isRunning || !startedAtRef.current}>
          Save
        </button>
      </div>
    </div>
  );
}
