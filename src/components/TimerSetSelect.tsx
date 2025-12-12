import { useEffect, useState } from "react";
import axios from "axios";

type TimerSet = {
  _id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  cycles: number;
};

type Props = {
  selectedTimerSet: string;
  onSelectTimerSet: (set: TimerSet | null) => void;
};


export default function TimerSetSelect({
  selectedTimerSet,
  onSelectTimerSet,
}: Props) {
  const [timerSets, setTimerSets] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:5001/timerSets", {
        params: { userId: "testuser" },
      });
      setTimerSets(res.data);
    };
    fetch();
  }, []);

  return (
    <div style={{ margin: "20px 0" }}>
      <label>Timer Set: </label>
      <select
        value={selectedTimerSet}
        onChange={(e) => {
  const selected = timerSets.find((s) => s._id === e.target.value);
  if (selected) onSelectTimerSet(selected);
}}
      >
        <option value="">選択してください</option>
        {timerSets.map((set) => (
          <option key={set._id} value={set._id}>
            {set.name}（{set.workDuration}分 + {set.breakDuration}分）
          </option>
        ))}
      </select>
    </div>
  );
}
