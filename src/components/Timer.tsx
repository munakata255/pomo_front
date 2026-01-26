import { useEffect, useState } from "react";
import { useTimerContext } from "../contexts/TimerContext";

export default function Timer() {
  const {
    timeLeft,
    initialTime,
    isRunning,
    phase,
    cycle,
    selectedTimerSet,
    start,
    stop,
    reset,
    save,
    hasTimerStarted,
    buttonMode,
  } = useTimerContext();
  // 秒 → mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ブラウザのタブタイトルに残り時間を表示
  useEffect(() => {
    if (isRunning) {
      const phaseEmoji = phase === "work" ? "🛠" : phase === "break" ? "🍵" : "🌿";
      document.title = `${formatTime(timeLeft)} ${phaseEmoji} - PomoFlow`;
    } else {
      document.title = "PomoFlow";
    }

    // クリーンアップ
    return () => {
      document.title = "PomoFlow";
    };
  }, [timeLeft, isRunning, phase]);

  // 円形プログレス用の計算
    // 円形プログレス用の計算
  const progress = initialTime > 0 
    ? Math.min(100, Math.max(0, ((initialTime - timeLeft) / (initialTime - 1)) * 100)) 
    : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const strokeColor = phase === "work" ? "#1976d2" : phase === "break" ? "#a2ccf7ff" : "#388e3c";

  const [hovered, setHovered] = useState<null | "start" | "stop" | "reset" | "save">(null);

  const baseButtonStyle = {
    padding: "16px 32px",
    fontSize: "18px",
    fontWeight: 700,
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "all 0.2s ease-out",
  } as const;

  const disabledStyle = {
    backgroundColor: "#f2f4f7",
    color: "#9aa5b1",
    border: "1px solid #c2ccdc",
    cursor: "not-allowed",
  } as const;

  const variants = {
    start: {
      backgroundColor: "#f7f8fa",
      color: "#36424f",
      border: "1px solid #cfd7e3",
    },
    stop: {
      backgroundColor: "#f7f8fa",
      color: "#36424f",
      border: "1px solid #cfd7e3",
    },
    reset: {
      backgroundColor: "#f7f8fa",
      color: "#36424f",
      border: "1px solid #cfd7e3",
    },
    save: {
      backgroundColor: "#f7f8fa",
      color: "#36424f",
      border: "1px solid #cfd7e3",
    },
  } as const;

  const hoverVariants = {
    start: {
      backgroundColor: "#e3e8f1",
      border: "1px solid #4c82c7ff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transform: "scale(1.03)",
    },
    stop: {
      backgroundColor: "#e3e8f1",
      border: "1px solid #4c82c7ff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transform: "scale(1.03)",
    },
    reset: {
      backgroundColor: "#e3e8f1",
      border: "1px solid #4c82c7ff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transform: "scale(1.03)",
    },
    save: {
      backgroundColor: "#e3e8f1",
      border: "1px solid #4c82c7ff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transform: "scale(1.03)",
    },
  } as const;

  const buttonStyle = (
    variant: keyof typeof variants,
    disabled: boolean,
    isHovered: boolean,
  ) => ({
    ...baseButtonStyle,
    ...variants[variant],
    ...(isHovered && !disabled ? hoverVariants[variant] : {}),
    ...(disabled ? disabledStyle : {}),
  });

  return (
    <div style={{ marginTop: "20px"}}>
      {/* 円形プログレスバー */}
      <div 
        style={{ 
          position: "relative", 
          width: "300px", 
          height: "300px", 
          margin: "0 auto 30px",
        }}
      >
        <svg width="300" height="300" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="150" cy="150" r={radius} stroke="#e0e0e0" strokeWidth="12" fill="none" />
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      <h2 style={{ fontSize: "100px", marginBottom: "20px" }}>
        {formatTime(timeLeft)}
      </h2>
      <div style={{ fontSize: "28px", marginBottom: "10px" }}>
        {phase === "work" && "🛠 作業中"}
        {phase === "break" && "🍵 休憩中"}
        {phase === "longBreak" && "🌿 長い休憩中"}
      </div>
      <div style={{ fontSize: "16px", marginBottom: "10px" }}>
        サイクル数: {cycle} / {selectedTimerSet?.cycles || 1}
      </div>

      {/* ボタン表示をモードに応じて切り替え */}
      {buttonMode === "buttons" ? (
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={start}
            disabled={isRunning}
            onMouseEnter={() => (!isRunning ? setHovered("start") : setHovered(null))}
            onMouseLeave={() => setHovered(null)}
            style={buttonStyle("start", isRunning, hovered === "start")}
          >
            Start
          </button>
          <button
            onClick={stop}
            disabled={!isRunning}
            onMouseEnter={() => (isRunning ? setHovered("stop") : setHovered(null))}
            onMouseLeave={() => setHovered(null)}
            style={buttonStyle("stop", !isRunning, hovered === "stop")}
          >
            Stop
          </button>
          <button
            onClick={reset}
            onMouseEnter={() => setHovered("reset")}
            onMouseLeave={() => setHovered(null)}
            style={buttonStyle("reset", false, hovered === "reset")}
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={isRunning || !hasTimerStarted || phase !== "work"}
            onMouseEnter={() =>
              isRunning || !hasTimerStarted || phase !== "work"
                ? setHovered(null)
                : setHovered("save")
            }
            onMouseLeave={() => setHovered(null)}
            style={buttonStyle(
              "save",
              isRunning || !hasTimerStarted || phase !== "work",
              hovered === "save",
            )}
          >
            Save
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={reset}
            onMouseEnter={() => setHovered("reset")}
            onMouseLeave={() => setHovered(null)}
            style={buttonStyle("reset", false, hovered === "reset")}
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={isRunning || !hasTimerStarted || phase !== "work"}
            onMouseEnter={() =>
              isRunning || !hasTimerStarted || phase !== "work"
                ? setHovered(null)
                : setHovered("save")
            }
            onMouseLeave={() => setHovered(null)}
            style={buttonStyle(
              "save",
              isRunning || !hasTimerStarted || phase !== "work",
              hovered === "save",
            )}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
