import { useTimerContext } from "../contexts/TimerContext";

export default function Timer() {
  const {
    timeLeft,
    isRunning,
    phase,
    cycle,
    selectedTimerSet,
    start,
    stop,
    reset,
    save,
    hasTimerStarted,
  } = useTimerContext();
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
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>
        {phase === "work" && "🛠 作業中"}
        {phase === "break" && "🍵 休憩中"}
        {phase === "longBreak" && "🌿 長い休憩中"}
      </div>
      <div style={{ fontSize: "16px", marginBottom: "10px" }}>
        サイクル数: {cycle} / {selectedTimerSet?.cycles || 1}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={start} disabled={isRunning}>
          Start
        </button>
        <button onClick={stop} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={reset}>Reset</button>
        <button
          onClick={save}
          disabled={isRunning || !hasTimerStarted || phase !== "work"}
        >
          Save
        </button>
      </div>
    </div>
  );
}
