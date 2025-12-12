import TaskSettings from "./TaskSettings";
import TimerSetSettings from "./TimerSetSettings";

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1>設定</h1>

      {/* ▼ タスク管理 */}
      <TaskSettings />

      {/* ▼ タイマーセット管理 */}
      <TimerSetSettings />
    </div>
  );
}
