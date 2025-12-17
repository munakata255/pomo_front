import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

type TimerSet = {
  _id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  cycles: number;
  longBreakDuration: number;
};

export default function TimerSetSettings() {
  const { user } = useAuth();
  const [timerSets, setTimerSets] = useState<TimerSet[]>([]);
  const [newSet, setNewSet] = useState({
    name: "",
    workDuration: 25,
    breakDuration: 5,
    cycles: 1,
    longBreakDuration: 15,
  });

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

  const addSet = async () => {
    if (!user?.uid) return;
    const res = await axios.post("http://localhost:5001/timerSets", {
      userId: user.uid,
      ...newSet,
    });
    setTimerSets([...timerSets, res.data]);
    setNewSet({ name: "", workDuration: 25, breakDuration: 5, cycles: 1, longBreakDuration: 15 });
  };

  const deleteSet = async (id: string) => {
    await axios.delete(`http://localhost:5001/timerSets/${id}`);
    setTimerSets(timerSets.filter((s) => s._id !== id));
  };

  return (
    <div>
      <h2>タイマーセット管理</h2>

      <div className="form-row">
        <input
          className="input-text"
          type="text"
          placeholder="セット名"
          value={newSet.name}
          onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
        />
        <input
          className="input-text"
          type="number"
          placeholder="作業(分)"
          value={newSet.workDuration}
          onChange={(e) =>
            setNewSet({ ...newSet, workDuration: Number(e.target.value) })
          }
        />
        <input
          className="input-text"
          type="number"
          placeholder="休憩(分)"
          value={newSet.breakDuration}
          onChange={(e) =>
            setNewSet({ ...newSet, breakDuration: Number(e.target.value) })
          }
        />
        <input
          className="input-text"
          type="number"
          placeholder="サイクル"
          value={newSet.cycles}
          onChange={(e) =>
            setNewSet({ ...newSet, cycles: Number(e.target.value) })
          }
        />
        <input
          className="input-text"
          type="number"
          placeholder="長休憩(分)"
          value={newSet.longBreakDuration}
          onChange={(e) =>
            setNewSet({ ...newSet, longBreakDuration: Number(e.target.value) })
          }
        />
        <button className="btn-primary" onClick={addSet}>追加</button>
      </div>

      <h2>既存のタイマーセット</h2>
      {timerSets.map((set) => (
        <div key={set._id} className="timer-set-item">
          <div className="timer-set-title">{set.name}</div>
          <div className="timer-set-meta">
            作業 {set.workDuration}分 / 休憩 {set.breakDuration}分 / {set.cycles} サイクル / 長休憩 {set.longBreakDuration}分
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="btn-danger" onClick={() => deleteSet(set._id)}>削除</button>
          </div>
        </div>
      ))}
    </div>
  );
}
