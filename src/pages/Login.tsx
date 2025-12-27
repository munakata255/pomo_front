import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // const [showDevLogin, setShowDevLogin] = useState(false);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 既にログイン済みの場合はホームにリダイレクト
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithPopup(auth, provider);
      navigate("/"); // ログイン成功後にホームへ遷移
    } catch (err) {
      const error = err as Error;
      setError(error.message || "ログインに失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const handleEmailLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   
  //   // 開発用の固定アカウント
  //   // const DEV_EMAIL = "dev@test.com";
  //   // const DEV_PASSWORD = "dev123";
  //   
  //   try {
  //     setLoading(true);
  //     setError("");
  //     
  //     // 開発用アカウントのチェック
  //     // if (email === DEV_EMAIL && password === DEV_PASSWORD) {
  //     //   // 開発用の固定ユーザーオブジェクト（uid: "testuser"）
  //     //   const devUser = {
  //     //     uid: "testuser",
  //     //     email: "dev@test.com",
  //     //     displayName: "開発用ユーザー",
  //     //   };
  //     //   localStorage.setItem("devUser", JSON.stringify(devUser));
  //     //   // ページをリロードしてAuthContextに反映
  //     //   window.location.href = "/";
  //     //   return;
  //     // }
  //     
  //     // それ以外はFirebase認証を試みる
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate("/");
  //   } catch (err) {
  //     setError("メールアドレスまたはパスワードが間違っています");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #5bc0de 0%, #5dade2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "40px 30px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* ロゴ/タイトル */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "24px", margin: "0", color: "#333" }}>PomoFlow</h1>
          <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "#999" }}>
            ポモフローへようこそ！！
          </p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              backgroundColor: "#ffeaea",
              border: "2px solid #ff6b6b",
              borderRadius: "6px",
              color: "#c92a2a",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* Googleログインボタン */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: "15px",
            fontWeight: "600",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "16px",
            transition: "background-color 0.2s",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "ログイン中..." : "🔍 Googleでログイン"}
        </button>

        {/* 区切り線 */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "24px 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
          <span style={{ padding: "0 12px", fontSize: "13px", color: "#999" }}>
            または
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }} />
        </div> */}

        {/* メールアドレスログイン
        <form onSubmit={handleEmailLogin}>
          <div style={{ marginBottom: "14px" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="メールアドレス"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "14px",
                border: "2px solid #e0e0e0",
                borderRadius: "6px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "#5bc0de")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#e0e0e0")
              }
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="パスワード"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "14px",
                border: "2px solid #e0e0e0",
                borderRadius: "6px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "#5bc0de")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#e0e0e0")
              }
            />
          </div>

          開発者ログイン情報
          {!showDevLogin && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: "#f0f9ff",
                border: "1px dashed #5bc0de",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#0066cc",
                lineHeight: "1.5",
              }}
            >
              <strong>📝 テスト用アカウント:</strong>
              <br />
              メール: dev@test.com
              <br />
              パス: dev123
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: "15px",
              fontWeight: "600",
              backgroundColor: "#5bc0de",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "16px",
              transition: "background-color 0.2s",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        */}

        {/* 補助リンク
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            textAlign: "center",
            borderTop: "1px solid #eee",
            paddingTop: "16px",
          }}
        >
          <button
            onClick={() => setShowDevLogin(!showDevLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#5bc0de",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              textDecoration: "none",
              padding: "4px 0",
            }}
          >
            ▶ {showDevLogin ? "テストログインを隠す" : "テストログイン"}
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#5bc0de",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              textDecoration: "none",
              padding: "4px 0",
            }}
          >
            ▶ ヘルプ
          </button>
        </div>
        */}
      </div>
    </div>
  );
}
