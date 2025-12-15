import { NavLink, Outlet } from "react-router-dom";
import { useTimerContext } from "../../contexts/TimerContext";
import "./nav.css";

export default function Layout() {
  const { timeLeft, isRunning, phase } = useTimerContext();

  // 秒 → mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getPhaseEmoji = () => {
    if (phase === "work") return "🛠";
    if (phase === "break") return "🍵";
    if (phase === "longBreak") return "🌿";
    return "";
  };

  return (
    <div>
      {/* ヘッダー */}
      <header
        style={{
          padding: "10px 20px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Pomodoro App</h2>

        {/* タイマー状態表示 */}
        {isRunning && (
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: phase === "work" ? "#d32f2f" : "#1976d2",
            }}
          >
            {getPhaseEmoji()} {formatTime(timeLeft)}
          </div>
        )}

        {/* ナビゲーション */}
        <nav style={{ display: "flex", gap: "20px" }}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Stats
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Settings
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About
          </NavLink>
        </nav>
      </header>

      {/* 各ページ */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
