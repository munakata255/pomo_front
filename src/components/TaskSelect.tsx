import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { Task } from "../types";

type Props = {
  selectedTask: string;
  onSelectTask: (taskId: string) => void;
};

export default function TaskSelect({ selectedTask, onSelectTask }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  const DEFAULT_TASKS: Task[] = [
    {
      _id: "default-task",
      name: "ポモドーロタイマー",
      userId: "guest",
    },
  ];

  // ▼ タスク一覧を取得
  useEffect(() => {
    const fetchTasks = async () => {
      // 未ログイン: ローカルデフォルトを使用（バックエンドへ送らない）
      if (!user?.uid) {
        setTasks(DEFAULT_TASKS);
        if (!selectedTask) {
          onSelectTask(DEFAULT_TASKS[0]._id);
        }
        return;
      }

      // ログイン時: バックエンドから取得
      try {
        const res = await axios.get("http://localhost:5001/tasks", {
          params: { userId: user.uid },
        });
        setTasks(res.data);

        // デフォルト選択を上書き（初回のみ）
        if (res.data.length > 0) {
          if (!selectedTask || selectedTask === DEFAULT_TASKS[0]._id) {
            onSelectTask(res.data[0]._id);
          }
        } else {
          // サーバーにタスクがない場合は選択解除
          if (selectedTask === DEFAULT_TASKS[0]._id) {
            onSelectTask("");
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchTasks();
  }, [user, selectedTask, onSelectTask]);

  return (
    <div style={{ margin: "20px 0" }}>
      <label style={{fontSize: "20px" }}>Task: </label>
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
