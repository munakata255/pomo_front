import { useState, useEffect, useRef } from "react";

export function useTimer(initialSeconds: number, onFinish: () => void) {
  const timeLeftRef = useRef(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // interval を保持する
  const intervalRef = useRef<number | null>(null);

  // Start
  const start = () => {
    if (isRunning) return; // 連打防止
    setIsRunning(true);

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        timeLeftRef.current = prev - 1;
        if (prev <= 1) {
          timeLeftRef.current = 0;
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop（一時停止）
  const stop = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current!);
  };

  // Reset
  const reset = (newSeconds?: number) => {
    stop();
    const sec = newSeconds ?? initialSeconds;
    setTimeLeft(sec);
    timeLeftRef.current = sec;
  };

  // 初期値が変わった場合（タイマーセット変更）
  useEffect(() => {
    reset();
  }, [initialSeconds]);

  // unmount時に確実に interval を消す
  useEffect(() => {
    return () => clearInterval(intervalRef.current!);
  }, []);

  return { timeLeft, timeLeftRef, isRunning, start, stop, reset };
}
