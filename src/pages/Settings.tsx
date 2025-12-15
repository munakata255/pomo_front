import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

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
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <h1>設定</h1>
      <h2>タスク管理</h2>

      {/* ▼ タスク追加 */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="新しいタスク名"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>追加</button>
      </div>

      {/* ▼ タスク一覧 + 編集 + 削除 */}
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              padding: "8px",
              marginBottom: "8px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <input
              type="text"
              value={task.name}
              onChange={(e) => updateTask(task._id, e.target.value)}
              style={{ width: "200px", marginRight: "10px" }}
            />

            <button onClick={() => deleteTask(task._id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
