import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTimerContext } from "../../contexts/TimerContext";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import "./nav.css";

export default function Layout() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { timeLeft, isRunning, phase } = useTimerContext();
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const getUserDisplayName = () => {
    if (!user) return "";
    if ("displayName" in user && user.displayName) return user.displayName;
    return user.email || "";
  };

  const handleProtectedNav = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string
  ) => {
    if (!user) {
      e.preventDefault();
      alert("現在開発中のため、このページはログイン後にご利用ください。");
      return;
    }
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("devUser");
      await signOut(auth);
      setShowAuthModal(false);
      window.location.href = "/";
    } catch (err) {
      console.error("ログアウトエラー:", err);
      alert("ログアウトに失敗しました");
    }
  };

  return (
    <div>
      {/* ヘッダー */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "10px 20px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "px" }}>
          <img src="/pomo.svg" alt="PomoFlow logo" width={24} height={24} />
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            PomoFlow
          </h2>
        </div>

        {/* タイマー状態表示 */}
        {isRunning && (
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: phase === "work" ? "#1976d2" : "#a2ccf7ff",
            }}
          >
            {getPhaseEmoji()} {formatTime(timeLeft)}
          </div>
        )}

        {/* ナビゲーション */}
        <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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
            onClick={(e) => handleProtectedNav(e, "/stats")}
          >
            Stats
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={(e) => handleProtectedNav(e, "/settings")}
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

          {/* 管理者専用リンク */}
          {role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              style={{ color: "#ff6b6b", fontWeight: "700" }}
            >
              Admin
            </NavLink>
          )}

          {/* ユーザー情報ボタン（ヘッダー右端） */}
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              marginLeft: "16px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {user ? "👤" : "🔓"}
          </button>
        </nav>
      </header>

      {/* 各ページ */}
      <main style={{ padding: "0px", paddingTop: "50px" }}>
        <Outlet />
      </main>

      {/* ログイン情報モーダル */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 200,
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              minWidth: "260px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {user ? (
              <div>
                <h3 style={{ marginTop: 0 }}>ユーザー情報</h3>
                <p style={{ margin: "6px 0" }}>✅ {getUserDisplayName()}</p>
                <p style={{ margin: "4px 0", opacity: 0.7, fontSize: "12px" }}>
                  {user.email}
                </p>
                <button
                  onClick={handleLogout}
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#d32f2f",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ marginTop: 0 }}>ログイン</h3>
                <p style={{ margin: "6px 0" }}>❌ ログインしていません</p>
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    navigate("/login");
                  }}
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#1976d2",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ログインページへ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
