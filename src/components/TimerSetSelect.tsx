import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { TimerSet } from "../types";

type Props = {
  selectedTimerSetId: string;
  onSelectTimerSet: (set: TimerSet | null) => void;
};

export default function TimerSetSelect({
  selectedTimerSetId,
  onSelectTimerSet,
}: Props) {
  const [timerSets, setTimerSets] = useState<TimerSet[]>([]);
  const { user } = useAuth();

  const DEFAULT_TIMER_SETS: TimerSet[] = [
    {
      _id: "default-timerset",
      name: "ポモドーロ 25/5 x4",
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 30,
      cycles: 4,
      userId: "guest",
    },
  ];

  useEffect(() => {
    const fetch = async () => {
      // 未ログイン: ローカルデフォルト
      if (!user?.uid) {
        setTimerSets(DEFAULT_TIMER_SETS);
        if (!selectedTimerSetId) {
          onSelectTimerSet(DEFAULT_TIMER_SETS[0]);
        }
        return;
      }

      // ログイン時: サーバーから取得
      const res = await axios.get("http://localhost:5001/timerSets", {
        params: { userId: user.uid },
      });
      setTimerSets(res.data);

      if (res.data.length > 0) {
        if (!selectedTimerSetId || selectedTimerSetId === DEFAULT_TIMER_SETS[0]._id) {
          onSelectTimerSet(res.data[0]);
        }
      } else {
        if (selectedTimerSetId === DEFAULT_TIMER_SETS[0]._id) {
          onSelectTimerSet(null);
        }
      }
    };
    fetch().catch((e) => console.error(e));
  }, [user, selectedTimerSetId, onSelectTimerSet]);

  return (
    <div style={{ margin: "20px 0" }}>
      <label style={{fontSize: "20px" }}>Timer Set: </label>
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
            {set.name}（🛠:{set.workDuration}分 + 🍵:{set.breakDuration}分 + 🌿{set.longBreakDuration ?? 0}分 + {set.cycles}サイクル）
          </option>
        ))}
      </select>
    </div>
  );
}
