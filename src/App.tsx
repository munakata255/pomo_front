import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ホーム（タイマー） */}
        <Route path="/" element={<Home />} />

        {/* 統計画面 */}
        <Route path="/stats" element={<Stats />} />

        {/* 設定（タスク・タイマーセット） */}
        <Route path="/settings" element={<Settings />} />

        {/* ログイン */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
