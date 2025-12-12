import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  selectedTimerSet: string;
  onSelectTimerSet: (setId: string) => void;
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
        onChange={(e) => onSelectTimerSet(e.target.value)}
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
