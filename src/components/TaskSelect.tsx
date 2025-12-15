import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

type Task = {
  _id: string;
  name: string;
};

type Props = {
  selectedTask: string;
  onSelectTask: (taskId: string) => void;
};

export default function TaskSelect({ selectedTask, onSelectTask }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // ▼ タスク一覧を取得
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.uid) return;
      try {
        const res = await axios.get("http://localhost:5001/tasks", {
          params: { userId: user.uid },
        });
        setTasks(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <div style={{ margin: "20px 0" }}>
      <label>Task: </label>
      <select
        value={selectedTask}
        onChange={(e) => onSelectTask(e.target.value)}
      >
        <option value="">選択してください</option>

        {/* ▼ バックエンドから取ってきたタスクを動的に表示 */}
        {tasks.map((task) => (
          <option key={task._id} value={task._id}>
            {task.name}
          </option>
        ))}
      </select>
    </div>
  );
}
