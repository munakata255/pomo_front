import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 既にログイン済みの場合はホームにリダイレクト
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user);
      navigate("/"); // ログイン成功後にホームへ遷移
    } catch (err) {
      alert("ログインエラー");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>ログイン</h2>
      <button onClick={handleLogin}>Googleでログイン</button>
    </div>
  );
}
