import TaskSettings from "./TaskSettings";
import TimerSetSettings from "./TimerSetSettings";
import ButtonSettings from "./ButtonSettings";
import "../../styles/settings.css";

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">⚙️ 設定</h1>

        {/* ▼ タスク管理 */}
        <div className="settings-card">
          <TaskSettings />
        </div>

        {/* ▼ タイマーセット管理 */}
        <div className="settings-card">
          <TimerSetSettings />
        </div>

        {/* ▼ ボタン操作設定 */}
        <div className="settings-card">
          <ButtonSettings />
        </div>
      </div>
    </div>
  );
}
