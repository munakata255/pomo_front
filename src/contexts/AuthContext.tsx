import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 開発用ユーザーのチェック
    const devUser = localStorage.getItem("devUser");
    if (devUser) {
      setUser(JSON.parse(devUser));
      return;
    }

    // Firebase認証のユーザー監視
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        // ログアウト時は開発用ユーザーもクリア
        const devUser = localStorage.getItem("devUser");
        if (!devUser) {
          setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
