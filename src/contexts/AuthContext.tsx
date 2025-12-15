import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";

// 開発用ユーザーの型定義
interface DevUser {
  uid: string;
  email: string;
  displayName?: string;
}

// コンテキストの型定義
interface AuthContextType {
  user: FirebaseUser | DevUser | null;
  setUser: (user: FirebaseUser | DevUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | DevUser | null>(null);

  useEffect(() => {
    // 開発用ユーザーのチェック
    const devUserStr = localStorage.getItem("devUser");
    if (devUserStr) {
      const devUser: DevUser = JSON.parse(devUserStr);
      setUser(devUser);
      return;
    }

    // Firebase認証のユーザー監視
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        // ログアウト時は開発用ユーザーもクリア
        const devUserStr = localStorage.getItem("devUser");
        if (!devUserStr) {
          setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
