import { useTimer } from "../hooks/useTimer";

type Props = {
  selectedTask: string;
  selectedTimerSet: string;
  initialTime: number; // ← Home側から渡す
};

export default function Timer({ selectedTask, selectedTimerSet, initialTime }: Props) {
  const { timeLeft, isRunning, start, stop, reset } = useTimer(initialTime);

  // 秒 → mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "48px", marginBottom: "20px" }}>
        {formatTime(timeLeft)}
      </h2>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={start} disabled={isRunning}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
