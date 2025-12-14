import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings/index";
import Login from "./pages/Login";

// layout
import Layout from "./components/Layout/Layout";

// context
import { TimerProvider } from "./contexts/TimerContext";

function App() {
  return (
    <BrowserRouter>
      <TimerProvider>
        <Routes>

          {/* Layout 配下にページを入れる */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* ログインは Layout なし */}
          <Route path="/login" element={<Login />} />

        </Routes>
      </TimerProvider>
    </BrowserRouter>
  );
}

export default App;
