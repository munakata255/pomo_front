import { NavLink, Outlet } from "react-router-dom";
import "./nav.css";

export default function Layout() {
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
        </nav>
      </header>

      {/* 各ページ */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
