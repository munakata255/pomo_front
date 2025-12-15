import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";
import { useTimerContext } from "../contexts/TimerContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import "./Home.css";

export default function Home() {
  const { selectedTask, selectedTimerSet, setSelectedTask, setSelectedTimerSet } =
    useTimerContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 開発用ユーザー情報をクリア
      localStorage.removeItem("devUser");
      await signOut(auth);
      // ページをリロードして状態をクリア
      window.location.href = "/";
    } catch (err) {
      console.error("ログアウトエラー:", err);
      alert("ログアウトに失敗しました");
    }
  };

  return (
    <div className="home-container">
      <h1>Pomodoro Timer</h1>

      {/* ログイン状態の表示 */}
      <div className="auth-card">
        {user ? (
          <div>
            <p>✅ ログイン中: {user.email}</p>
            <button className="auth-btn" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        ) : (
          <div>
            <p>❌ ログインしていません</p>
            <button className="auth-btn" onClick={() => navigate("/login")}>
              ログインページへ
            </button>
          </div>
        )}
      </div>

      {/* タスク選択 */}
      <div className="selection-section">
        <TaskSelect
          selectedTask={selectedTask}
          onSelectTask={setSelectedTask}
        />
      </div>

      {/* タイマーセット選択 */}
      <div className="selection-section">
        <TimerSetSelect
          selectedTimerSetId={selectedTimerSet?._id || ""}
          onSelectTimerSet={setSelectedTimerSet}
        />
      </div>

      {/* 選択情報表示 */}
      {selectedTask && selectedTimerSet && (
        <div className="selected-info">
          <p>⏱️ <strong>{selectedTimerSet.name}</strong></p>
          <p>作業: {selectedTimerSet.workDuration}分 | 休憩: {selectedTimerSet.breakDuration}分 | {selectedTimerSet.cycles}サイクル</p>
        </div>
      )}

      {/* タイマー表示 */}
      <div className="timer-wrapper">
        <Timer />
      </div>
    </div>
  );
}
