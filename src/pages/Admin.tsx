import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, doc, setDoc, getDocs, Timestamp } from "firebase/firestore";
import type { AllowedUser } from "../types";
import "../styles/settings.css";

export default function Admin() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // admin以外はアクセス禁止
  useEffect(() => {
    if (!user || role !== "admin") {
      alert("この画面は管理者専用です");
      navigate("/");
    }
  }, [user, role, navigate]);

  // 招待済みユーザー一覧取得
  useEffect(() => {
    const fetchAllowedUsers = async () => {
      if (role !== "admin") return;
      try {
        const querySnapshot = await getDocs(collection(db, "allowedUsers"));
        const users: AllowedUser[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push({
            email: doc.id,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });
        setAllowedUsers(users);
      } catch (error) {
        console.error("ユーザー取得エラー:", error);
      }
    };
    fetchAllowedUsers();
  }, [role]);

  // 新規ユーザー招待
  const handleInviteUser = async () => {
    if (!newEmail.trim()) {
      alert("メールアドレスを入力してください");
      return;
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert("有効なメールアドレスを入力してください");
      return;
    }

    // 既に存在するかチェック
    if (allowedUsers.some((u) => u.email === newEmail)) {
      alert("このメールアドレスは既に登録されています");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "allowedUsers", newEmail), {
        role: "user",
        createdAt: Timestamp.now(),
      });

      // ローカル状態を更新
      setAllowedUsers([
        ...allowedUsers,
        {
          email: newEmail,
          role: "user",
          createdAt: new Date(),
        },
      ]);

      alert(`招待しました: ${newEmail}`);
      setNewEmail("");
    } catch (error) {
      console.error("招待エラー:", error);
      alert("招待に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (role !== "admin") {
    return null;
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">🔐 招待ユーザー管理</h1>

        {/* 新規招待カード */}
        <div className="settings-card">
          <h2>新規ユーザーを招待</h2>

          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              メールアドレス（Googleアカウント）
            </label>
            <input
              className="input-text"
              type="email"
              placeholder="example@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInviteUser();
              }}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleInviteUser}
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "招待中..." : "➕ 招待する"}
          </button>
        </div>

        {/* 招待済みユーザー一覧 */}
        <div className="settings-card">
          <h2>招待済みユーザー一覧（{allowedUsers.length}人）</h2>

          {allowedUsers.length === 0 ? (
            <p className="tasks-empty">まだユーザーが招待されていません</p>
          ) : (
            <div className="tasks-list">
              {allowedUsers.map((u) => (
                <div key={u.email} className="task-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {u.role === "admin" ? "👑" : "👤"} {u.email}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      <div>
                        権限:{" "}
                        <span
                          style={{
                            background:
                              u.role === "admin" ? "#ffeaa7" : "#dfe6e9",
                            padding: "2px 8px",
                            borderRadius: "3px",
                            fontWeight: "600",
                          }}
                        >
                          {u.role === "admin" ? "管理者" : "ユーザー"}
                        </span>
                      </div>
                      <div style={{ marginTop: "2px" }}>
                        登録日: {u.createdAt.toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
