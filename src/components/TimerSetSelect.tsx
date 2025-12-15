import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

type TimerSet = {
  _id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  cycles: number;
};

type Props = {
  selectedTimerSetId: string;
  onSelectTimerSet: (set: TimerSet | null) => void;
};

export default function TimerSetSelect({
  selectedTimerSetId,
  onSelectTimerSet,
}: Props) {
  const [timerSets, setTimerSets] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      if (!user?.uid) return;
      const res = await axios.get("http://localhost:5001/timerSets", {
        params: { userId: user.uid },
      });
      setTimerSets(res.data);
    };
    fetch();
  }, [user]);

  return (
    <div style={{ margin: "20px 0" }}>
      <label>Timer Set: </label>
      <select
        value={selectedTimerSetId}
        onChange={(e) => {
          const selected = timerSets.find((s) => s._id === e.target.value);
          if (selected) onSelectTimerSet(selected);
        }}
      >
        <option value="">選択してください</option>
        {timerSets.map((set) => (
          <option key={set._id} value={set._id}>
            {set.name}（{set.workDuration}分 + {set.breakDuration}分 + {set.longBreakDuration}分 + {set.cycles}サイクル）
          </option>
        ))}
      </select>
    </div>
  );
}
