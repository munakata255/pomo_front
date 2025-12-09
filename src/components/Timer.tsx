import { useState, useEffect } from "react";

type Props = {
  selectedTask: string;
  selectedTimerSet: string;
};

export default function Timer({ selectedTask, selectedTimerSet }: Props) {

  // 選択されたセットに応じて初期時間を変える（暫定）
  const getInitialTime = () => {
    switch (selectedTimerSet) {
      case "set1":
        return 25 * 60;
      case "set2":
        return 50 * 60;
      case "set3":
        return 90 * 60;
      default:
        return 25 * 60; // デフォルト25分
    }
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());

  // セットを変更したらタイマー時間を更新する
  useEffect(() => {
    setTimeLeft(getInitialTime());
  }, [selectedTimerSet]);

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
        <button>Start</button>
        <button>Stop</button>
        <button>Reset</button>
      </div>
    </div>
  );
}
