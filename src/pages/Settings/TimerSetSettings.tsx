import { useEffect, useState } from "react";
import axios from "axios";

type TimerSet = {
  _id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  cycles: number;
  longBreakDuration: number;
};

export default function TimerSetSettings() {
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
      const res = await axios.get("http://localhost:5001/timerSets", {
        params: { userId: "testuser" },
      });
      setTimerSets(res.data);
    };
    fetch();
  }, []);

  const addSet = async () => {
    const res = await axios.post("http://localhost:5001/timerSets", {
      userId: "testuser",
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
    <>
      <h2 style={{ marginTop: 40 }}>タイマーセット管理</h2>

      <input
        type="text"
        placeholder="セット名"
        value={newSet.name}
        onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
      />
      <input
        type="number"
        value={newSet.workDuration}
        onChange={(e) =>
          setNewSet({ ...newSet, workDuration: Number(e.target.value) })
        }
      />
      <input
        type="number"
        value={newSet.breakDuration}
        onChange={(e) =>
          setNewSet({ ...newSet, breakDuration: Number(e.target.value) })
        }
      />
      <input
        type="number"
        value={newSet.cycles}
        onChange={(e) =>
          setNewSet({ ...newSet, cycles: Number(e.target.value) })
        }
      />
      <input
        type="number"
        value={newSet.longBreakDuration}
        onChange={(e) =>
          setNewSet({ ...newSet, longBreakDuration: Number(e.target.value) })
        }
      />

      <button onClick={addSet}>追加</button>

      <h2>既存のタイマーセット</h2>
      {timerSets.map((set) => (
        <div key={set._id} style={{ border: "1px solid #ccc", margin: "5px" }}>
          <strong>{set.name}</strong>
          <p>
            作業 {set.workDuration}分 / 休憩 {set.breakDuration}分 / {set.cycles}
            サイクル  / 長休憩 {set.longBreakDuration}分
          </p>
          <button onClick={() => deleteSet(set._id)}>削除</button>
        </div>
      ))}
    </>
  );
}
