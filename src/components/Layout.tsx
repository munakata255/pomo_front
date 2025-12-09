import { Link, Outlet } from "react-router-dom";
//import "./Layout.css"; // 後で作るCSS（今はなくてOK）

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
          <Link to="/">Home</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </header>

      {/* 各ページがここに表示される */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
