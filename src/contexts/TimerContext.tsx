import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";
import type { TimerSet, Phase } from "../types";
import finishWorkSound from "../assets/sounds/finishWork.mp3";
import finishBreakSound from "../assets/sounds/finishBreak.mp3";

interface TimerContextType {
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

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedTimerSet, setSelectedTimerSet] = useState<TimerSet | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("work");
  const [cycle, setCycle] = useState(1);
  const [hasTimerStarted, setHasTimerStarted] = useState(false);

  const timeLeftRef = useRef(0);
  const phaseRef = useRef<Phase>("work");
  const cycleRef = useRef(1);
  const intervalRef = useRef<number | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const currentPhaseInitialTimeRef = useRef(0);
  const finishInFlightRef = useRef(false);

  const getPhaseSeconds = (phase: Phase) => {
    if (phase === "work") return Math.max(1, Math.round((selectedTimerSet?.workDuration ?? 25) * 60));
    if (phase === "break") return Math.max(1, Math.round((selectedTimerSet?.breakDuration ?? 5) * 60));
    return Math.max(1, Math.round((selectedTimerSet?.longBreakDuration ?? 0.01) * 60));
  };

  const startPhase = (nextPhase: Phase, options?: { incrementCycle?: boolean; resetCycle?: boolean }) => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const nextSec = getPhaseSeconds(nextPhase);

    phaseRef.current = nextPhase;
    setPhase(nextPhase);

    if (options?.resetCycle) {
      cycleRef.current = 1;
      setCycle(1);
    } else if (options?.incrementCycle) {
      cycleRef.current += 1;
      setCycle(cycleRef.current);
    }

    setTimeLeft(nextSec);
    setInitialTime(nextSec);
    timeLeftRef.current = nextSec;
    currentPhaseInitialTimeRef.current = nextSec;
    startedAtRef.current = new Date();

    startTimer();
  };

  // サウンドを再生する関数
  const playSound = (soundUrl: string) => {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch((error) => {
        console.error("音声再生エラー:", error);
      });
    } catch (error) {
      console.error("音声ファイル読み込みエラー:", error);
    }
  };

  // タイマーが終了したときの処理
  const handleFinish = async () => {
    if (finishInFlightRef.current) return;
    finishInFlightRef.current = true;

    const currentPhase = phaseRef.current;
    if (!startedAtRef.current) {
      finishInFlightRef.current = false;
      return;
    }

    // フェーズに応じた音を再生
    if (currentPhase === "work") {
      playSound(finishWorkSound);
    } else if (currentPhase === "break" || currentPhase === "longBreak") {
      playSound(finishBreakSound);
    }

    // work フェーズのときだけ学習ログを保存
    if (currentPhase === "work" && user?.uid) {
      const duration = currentPhaseInitialTimeRef.current - timeLeftRef.current;
      try {
        await api.post("/studyLogs", {
          userId: user.uid,
          taskId: selectedTask,
          timerSetId: selectedTimerSet?._id || "",
          startedAt: startedAtRef.current,
          finishedAt: new Date(),
          durationSeconds: duration,
          status: "completed",
        });
      } catch (e) {
        console.error("学習ログの保存に失敗:", e);
      }
    }

    // フェーズ切り替え
    try {
      if (currentPhase === "work") {
        // work → break
        startPhase("break");
      } else if (currentPhase === "break") {
        const isLastCycle = cycleRef.current === (selectedTimerSet?.cycles ?? 1);
        if (isLastCycle) {
          // 最後の break の後は longBreak
          startPhase("longBreak");
        } else {
          // 通常サイクルは work に戻る
          startPhase("work", { incrementCycle: true });
        }
      } else if (currentPhase === "longBreak") {
        // 全サイクル完了
        const shouldContinue = window.confirm("サイクルが完了しました！続けますか？");
        if (shouldContinue) {
          startPhase("work", { resetCycle: true });
        } else {
          // リセット
          resetTimer();
        }
      }
    } finally {
      finishInFlightRef.current = false;
    }
  };

  // タイマーを開始する内部関数
  const startTimer = () => {
    if (intervalRef.current !== null) return;
    
    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      timeLeftRef.current = timeLeftRef.current - 1;
      setTimeLeft(timeLeftRef.current);
      
      if (timeLeftRef.current <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsRunning(false);
        handleFinish();
      }
    }, 1000);
  };

  // ユーザーがStartボタンを押したとき
  const start = () => {
    if (!selectedTask) {
      alert("Taskを選択してください");
      return;
    }
    if (!selectedTimerSet || !selectedTimerSet._id) {
      alert("TimerSetを選択してください");
      return;
    }

    if (intervalRef.current !== null) return; // 既に実行中
    
    if (!hasTimerStarted) {
      // 初回スタート時は work フェーズの時間を設定
      const initialTime = selectedTimerSet.workDuration * 60;
      setTimeLeft(initialTime);
      setInitialTime(initialTime);
      timeLeftRef.current = initialTime;
      currentPhaseInitialTimeRef.current = initialTime;
      phaseRef.current = "work";
      setPhase("work");
      cycleRef.current = 1;
      setCycle(1);
      setHasTimerStarted(true);
    }

    startedAtRef.current = new Date();
    startTimer();
  };

  // 一時停止
  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  // リセット
  const reset = () => {
    if (startedAtRef.current) {
      const confirmed = window.confirm(
        "タイマーをリセットすると、サイクルが最初の状態（work）に戻ります。よろしいですか？"
      );
      if (!confirmed) return;
    }
    resetTimer();
  };

  const resetTimer = () => {
    stop();
    cycleRef.current = 1;
    setCycle(1);
    phaseRef.current = "work";
    setPhase("work");
    startedAtRef.current = null;
    setHasTimerStarted(false);
    
    if (selectedTimerSet) {
      const initialTime = selectedTimerSet.workDuration * 60;
      setTimeLeft(initialTime);
      setInitialTime(initialTime);
      timeLeftRef.current = initialTime;
      currentPhaseInitialTimeRef.current = initialTime;
    } else {
      setTimeLeft(0);
      setInitialTime(0);
      timeLeftRef.current = 0;
      currentPhaseInitialTimeRef.current = 0;
    }
  };

  // 途中保存
  const save = async () => {
    if (!startedAtRef.current) {
      alert("まだ開始されていません");
      return;
    }
    if (phase !== "work") {
      alert("作業フェーズでのみ保存できます");
      return;
    }
    if (!user?.uid) {
      alert("ユーザーがログインしていません");
      return;
    }

    const finishedAt = new Date();
    const durationSeconds = currentPhaseInitialTimeRef.current - timeLeftRef.current;

    try {
      await api.post("/studyLogs", {
        userId: user.uid,
        taskId: selectedTask,
        timerSetId: selectedTimerSet?._id,
        startedAt: startedAtRef.current,
        finishedAt,
        durationSeconds,
        status: "interrupted",
      });
      alert("途中までの勉強時間を保存しました✨");
    } catch (e) {
      alert("保存に失敗しました");
      console.error(e);
    }
  };

  // タイマーセットが変更されたときの処理
  const handleSetTimerSet = (timerSet: TimerSet | null) => {
    if (hasTimerStarted) {
      const confirmed = window.confirm(
        "タイマー実行中です。Timer Setを変更するとサイクルが最初の状態（work）にリセットされます。よろしいですか？"
      );
      if (!confirmed) return;
      resetTimer();
    }
    setSelectedTimerSet(timerSet);
    // resetTimer() が既に時間を設定しているので、hasTimerStarted が false の場合のみ更新
    if (timerSet && !hasTimerStarted) {
      const initialTime = timerSet.workDuration * 60;
      setTimeLeft(initialTime);
      setInitialTime(initialTime);
      timeLeftRef.current = initialTime;
      currentPhaseInitialTimeRef.current = initialTime;
    }
  };

  // タスクが変更されたときの処理
  const handleSetTask = (taskId: string) => {
    if (hasTimerStarted) {
      const confirmed = window.confirm(
        "タイマー実行中です。タスクを変更するとサイクルが最初の状態（work）にリセットされます。よろしいですか？"
      );
      if (!confirmed) return;
      resetTimer();
    }
    setSelectedTask(taskId);
  };

  // アンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const value: TimerContextType = {
    timeLeft,
    initialTime,
    isRunning,
    phase,
    cycle,
    selectedTask,
    selectedTimerSet,
    setSelectedTask: handleSetTask,
    setSelectedTimerSet: handleSetTimerSet,
    start,
    stop,
    reset,
    save,
    hasTimerStarted,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}
