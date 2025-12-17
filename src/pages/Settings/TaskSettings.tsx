import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

type Task = {
  _id: string;
  name: string;
  color?: string;
  isActive: boolean;
};

export default function Settings() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // ▼ タスク一覧取得
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.uid) return;
      const res = await axios.get("http://localhost:5001/tasks", {
        params: { userId: user.uid },
      });
      setTasks(res.data);
    };
    fetchTasks();
  }, [user]);

  // ▼ タスク追加
  const addTask = async () => {
    if (!newTask.trim() || !user?.uid) return;

    const res = await axios.post("http://localhost:5001/tasks", {
      userId: user.uid,
      name: newTask,
      color: "#FFA500",
      isActive: true,
    });

    setTasks([...tasks, res.data]);
    setNewTask("");
  };

  // ▼ タスク削除
  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:5001/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // ▼ タスク名更新
  const updateTask = async (id: string, newName: string) => {
    const res = await axios.put(`http://localhost:5001/tasks/${id}`, {
      name: newName,
    });

    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  return (
    <div>
      <h2>タスク管理</h2>

      {/* ▼ タスク追加 */}
      <div className="form-row">
        <input
          className="input-text"
          type="text"
          placeholder="新しいタスク名"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button className="btn-primary" onClick={addTask}>追加</button>
      </div>

      {/* ▼ タスク一覧 + 編集 + 削除 */}
      {tasks.length === 0 ? (
        <p className="tasks-empty">タスクがまだ登録されていません</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-item">
              <input
                className="task-input"
                type="text"
                value={task.name}
                onChange={(e) => updateTask(task._id, e.target.value)}
              />
              <button className="btn-danger" onClick={() => deleteTask(task._id)}>
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
