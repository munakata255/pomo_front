import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useAuth } from "../../contexts/AuthContext";
import type { TimerSet } from "../../types";

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
      const res = await api.get("/timerSets", {
        params: { userId: user.uid },
      });
      setTimerSets(res.data);
    };
    fetch();
  }, [user]);

  const addSet = async () => {
    if (!user?.uid) return;
    const res = await api.post("/timerSets", {
      userId: user.uid,
      ...newSet,
    });
    setTimerSets([...timerSets, res.data]);
    setNewSet({ name: "", workDuration: 25, breakDuration: 5, cycles: 1, longBreakDuration: 15 });
  };

  const deleteSet = async (id: string) => {
    await api.delete(`/timerSets/${id}`);
    setTimerSets(timerSets.filter((s) => s._id !== id));
  };

  return (
    <div>
      <h2>タイマーセット管理</h2>

      <div style={{ marginBottom: "20px", padding: "12px" }}>
        {/* 1行目: セット名(70%) + サイクル数(30%) */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
          <div style={{ flex: "7" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", fontSize: "13px" }}>
              セット名
            </label>
            <input
              className="input-text"
              type="text"
              placeholder="例: ポモドーロ基本"
              value={newSet.name}
              onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ flex: "3" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", fontSize: "13px" }}>
              サイクル数
            </label>
            <input
              className="input-text"
              type="number"
              placeholder="4"
              value={newSet.cycles}
              onChange={(e) =>
                setNewSet({ ...newSet, cycles: Number(e.target.value) })
              }
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* 2行目: 作業時間 + 休憩時間 + 長休憩 */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", fontSize: "13px" }}>
              🛠:作業時間（分）
            </label>
            <input
              className="input-text"
              type="number"
              placeholder="25"
              value={newSet.workDuration}
              onChange={(e) =>
                setNewSet({ ...newSet, workDuration: Number(e.target.value) })
              }
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", fontSize: "13px" }}>
              🍵:休憩時間（分）
            </label>
            <input
              className="input-text"
              type="number"
              placeholder="5"
              value={newSet.breakDuration}
              onChange={(e) =>
                setNewSet({ ...newSet, breakDuration: Number(e.target.value) })
              }
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", fontSize: "13px" }}>
              🌿:長休憩（分）
            </label>
            <input
              className="input-text"
              type="number"
              placeholder="15"
              value={newSet.longBreakDuration}
              onChange={(e) =>
                setNewSet({ ...newSet, longBreakDuration: Number(e.target.value) })
              }
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={addSet}
          style={{ marginTop: "12px", width: "100%" }}
        >
          追加
        </button>
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
