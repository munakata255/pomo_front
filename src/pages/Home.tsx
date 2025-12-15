import TaskSelect from "../components/TaskSelect";
import TimerSetSelect from "../components/TimerSetSelect";
import Timer from "../components/Timer";
import { useTimerContext } from "../contexts/TimerContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

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
    <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
      <h1>Pomodoro Timer</h1>

      {/* ログイン状態の表示 */}
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        {user ? (
          <div>
            <p style={{ margin: "5px 0" }}>✅ ログイン中: {user.email}</p>
            <button onClick={handleLogout} style={{ marginTop: "5px" }}>
              ログアウト
            </button>
          </div>
        ) : (
          <div>
            <p style={{ margin: "5px 0" }}>❌ ログインしていません</p>
            <button onClick={() => navigate("/login")} style={{ marginTop: "5px" }}>
              ログインページへ
            </button>
          </div>
        )}
      </div>

      {/* タスク選択 */}
      <TaskSelect
        selectedTask={selectedTask}
        onSelectTask={setSelectedTask}
      />

      {/* タイマーセット選択 */}
      <TimerSetSelect
        selectedTimerSetId={selectedTimerSet?._id || ""}
        onSelectTimerSet={setSelectedTimerSet}
      />

      {/* タイマー表示 */}
      <Timer />
    </div>
  );
}
