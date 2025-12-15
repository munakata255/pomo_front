import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user);
      navigate("/"); // ログイン成功後にホームへ遷移
    } catch (err: any) {
      setError(err.message || "ログインに失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 開発用の固定アカウント
    const DEV_EMAIL = "dev@test.com";
    const DEV_PASSWORD = "dev123";
    
    try {
      setLoading(true);
      setError("");
      
      // 開発用アカウントのチェック
      if (email === DEV_EMAIL && password === DEV_PASSWORD) {
        // 開発用の固定ユーザーオブジェクト（uid: "testuser"）
        const devUser = {
          uid: "testuser",
          email: "dev@test.com",
          displayName: "開発用ユーザー",
        };
        localStorage.setItem("devUser", JSON.stringify(devUser));
        // ページをリロードしてAuthContextに反映
        window.location.href = "/";
        return;
      }
      
      // それ以外はFirebase認証を試みる
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("メールアドレスまたはパスワードが間違っています");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "60px auto" }}>
      <h2 style={{ textAlign: "center" }}>ログイン</h2>

      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c00",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {loading ? "ログイン中..." : "Googleでログイン"}
      </button>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={() => setShowDevLogin(!showDevLogin)}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "14px",
          }}
        >
          {showDevLogin ? "開発者ログインを隠す" : "開発者ログイン"}
        </button>
      </div>

      {showDevLogin && (
        <form onSubmit={handleEmailLogin} style={{ marginTop: "20px" }}>
          <div style={{ 
            padding: "10px", 
            marginBottom: "15px", 
            backgroundColor: "#f0f8ff", 
            border: "1px solid #b0d4f1",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#0066cc"
          }}>
            <strong>開発用アカウント:</strong><br />
            メール: dev@test.com<br />
            パスワード: dev123
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="dev@test.com"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="dev123"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              backgroundColor: "#34a853",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "ログイン中..." : "メールアドレスでログイン"}
          </button>
        </form>
      )}
    </div>
  );
}
