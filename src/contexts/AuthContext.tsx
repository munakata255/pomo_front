import { createContext, useEffect, useState, useContext } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
  role: "admin" | "user" | null;
  setUser: (user: FirebaseUser | DevUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | DevUser | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
    // 開発用ユーザーのチェック
    const devUserStr = localStorage.getItem("devUser");
    if (devUserStr) {
      const devUser: DevUser = JSON.parse(devUserStr);
      setUser(devUser);
      setRole("admin"); // 開発ユーザーはadminとして扱う
      return;
    }

    // Firebase認証のユーザー監視
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Firestoreで招待チェック
        try {
          const allowedUserDoc = await getDoc(doc(db, "allowedUsers", u.email || ""));
          
          if (allowedUserDoc.exists()) {
            // 招待済みユーザー
            const data = allowedUserDoc.data();
            setUser(u);
            setRole(data.role || "user");
          } else {
            // 招待されていないユーザー
            alert("このサービスは招待制です。\n管理者から招待を受けてください。");
            await firebaseSignOut(auth);
            setUser(null);
            setRole(null);
          }
        } catch (error) {
          console.error("招待チェックエラー:", error);
          alert("認証エラーが発生しました");
          await firebaseSignOut(auth);
          setUser(null);
          setRole(null);
        }
      } else {
        // ログアウト時は開発用ユーザーもクリア
        const devUserStr = localStorage.getItem("devUser");
        if (!devUserStr) {
          setUser(null);
          setRole(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, role, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
