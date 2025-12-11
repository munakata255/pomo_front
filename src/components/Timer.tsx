import axios from "axios";
import { useTimer } from "../hooks/useTimer";

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
  const handleFinish = async () => {
    alert("ポモドーロ終了！");
    // ここで StudyLog を POST する処理を後で追加
    try {
      await axios.post("http://localhost:5001/studyLogs", {
        userId: "testuser", // 後で Firebase UID に変更
        taskId: selectedTask,
        timerSetId: selectedTimerSet,
        startedAt: new Date(Date.now() - initialTime * 1000),
        finishedAt: new Date(),
        durationSeconds: initialTime,
        status: "completed",
      });

      alert("保存完了しました🔥");
    } catch (error) {
      console.error(error);
      alert("保存に失敗しました");
      console.log("selectedTask =", selectedTask);
console.log("selectedTimerSet =", selectedTimerSet);
console.log("initialTime =", initialTime);

    }
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

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "48px", marginBottom: "20px" }}>
        {formatTime(timeLeft)}
      </h2>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={start} disabled={isRunning}>
          Start
        </button>
        <button onClick={stop} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
