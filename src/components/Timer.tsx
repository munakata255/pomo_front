import axios from "axios";
import { useTimer } from "../hooks/useTimer";
import { useState, useRef } from "react";

type TimerSet = {
  _id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  longBreakDuration?: number;
  cycles: number;
};

type Props = {
  selectedTask: string;
  selectedTimerSet: TimerSet | null;
  initialTime: number; // ← Home側から渡す
  onAllFinished: () => void;
};

export default function Timer({
  selectedTask,
  selectedTimerSet,
  initialTime,
  onAllFinished,
}: Props) {
  const startedAtRef = useRef<Date | null>(null);

  type Phase = "work" | "break" | "longBreak";

  // 現在のフェーズ
  const [phase, setPhase] = useState<Phase>("work");
  const phaseRef = useRef<Phase>("work");
  const updatePhase = (next: Phase) => {
    setPhase(next);
    phaseRef.current = next; // ← 常に最新のフェーズを保持
  };

  // 今何サイクル目か
  const cycleRef = useRef(1);

  // 今のフェーズの開始時間（何秒だったか）
  const currentPhaseInitialTimeRef = useRef(initialTime);

  const handleFinish = async () => {
    const currentPhase = phaseRef.current;
    if (!startedAtRef.current) return console.error("startedAt is null");
    console.log(`フェーズ ${currentPhase} が終了しました`);
    // ① work フェーズのときだけ学習ログを保存
    if (currentPhase === "work") {
      const duration = currentPhaseInitialTimeRef.current - timeLeftRef.current;
      await axios.post("http://localhost:5001/studyLogs", {
        userId: "testuser",
        taskId: selectedTask,
        timerSetId: selectedTimerSet?._id || "",
        startedAt: startedAtRef.current,
        finishedAt: new Date(),
        durationSeconds: duration,
        status: "completed",
      });
    }

    // ② フェーズ切り替え
    if (currentPhase === "work") {
      // work → break
      updatePhase("break");
      console.log(`フェーズ ${currentPhase} が終了しました`);
      const nextSec = (selectedTimerSet?.breakDuration ?? 5) * 60;
      reset(nextSec);
      currentPhaseInitialTimeRef.current = nextSec;
    } else if (currentPhase === "break") {
      // break → work or longBreak（最後だけ longBreak）
      const isLastCycle = cycleRef.current === (selectedTimerSet?.cycles ?? 1);
      if (isLastCycle) {
        // 最後の break の後だけ longBreak
        updatePhase("longBreak");
        const nextSec = (selectedTimerSet?.longBreakDuration ?? 0.01) * 60;
        reset(nextSec);
        currentPhaseInitialTimeRef.current = nextSec;
      } else {
        // 通常サイクルは work に戻る
        updatePhase("work");
        const nextSec = (selectedTimerSet?.workDuration ?? 25) * 60;
        reset(nextSec);
        currentPhaseInitialTimeRef.current = nextSec;
      }
      if (!isLastCycle) {
        cycleRef.current += 1; // break が終わった時にサイクルを進める
        console.log(`サイクルが進みました: ${cycleRef.current}`);
      }
    } else if (currentPhase === "longBreak") {
      console.log("全フェーズ完了！");
      // サイクルをリセット
      cycleRef.current = 1;
      updatePhase("work");
      // ユーザーに続行するか確認
      const shouldContinue =
        window.confirm("サイクルが完了しました！続けますか？");

      if (shouldContinue) {
        cycleRef.current = 1;
        setPhase("work");

        const nextSec = (selectedTimerSet?.workDuration ?? 25) * 60;
        reset(nextSec);
        currentPhaseInitialTimeRef.current = nextSec;

        startedAtRef.current = new Date();
        start();
      } else {
        // ← これがエラーの原因なので、直接呼ばない！
        // onAllFinished();

        // ✔ 解決：イベントループの次のタイミングで呼ぶ
        setTimeout(() => {
          onAllFinished();
        }, 0);
      }

      return;
    }
    // ③ 次フェーズの開始を記録
    startedAtRef.current = new Date();
    start();
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

  const { timeLeft, timeLeftRef, isRunning, start, stop, reset } = useTimer(
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
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>
        {phase === "work" && "🛠 作業中"}
        {phase === "break" && "🍵 休憩中"}
        {phase === "longBreak" && "🌿 長い休憩中"}
      </div>
      <div style={{ fontSize: "16px", marginBottom: "10px" }}>
        サイクル数: {cycleRef.current} / {selectedTimerSet?.cycles || 1}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handleStop} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={handleReset}>Reset</button>
        <button
          onClick={handleSave}
          disabled={isRunning || !startedAtRef.current || phase !== "work"}
        >
          Save
        </button>
      </div>
    </div>
  );
}
