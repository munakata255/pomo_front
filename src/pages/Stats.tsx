import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatsGraph from "../components/StatsGraph";
import { useAuth } from "../contexts/AuthContext";
import type { StatsData, StudyLog, Task, TaskSummary } from "../types";

export default function Stats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [mode, setMode] = useState<"daily" | "weekly" | "monthly">("daily");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayStats, setTodayStats] = useState<StatsData | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateStats, setSelectedDateStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.uid) return;
      try {
        const res = await api.get("/tasks", {
          params: { userId: user.uid },
        });
        setTasks(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;
      try {
        const res = await api.get("/stats", {
          params: { userId: user.uid },
        });

        setStats(res.data);
      } catch (error) {
        console.error(error);
        alert("統計データの取得に失敗しました");
      }
    };

    fetchStats();
  }, [user]);
  // StudyLogs の取得
  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.uid) return;
      try {
        const res = await api.get("/studyLogs", {
          params: { userId: user.uid },
        });
        setLogs(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLogs();
  }, [user]);

  useEffect(() => {
    const fetchTodayStats = async () => {
      if (!user?.uid) return;
      try {
        const res = await api.get("/stats/today", {
          params: { userId: user.uid },
        });
        setTodayStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodayStats();
  }, [user]);
  const fetchStatsByDate = async (date: string) => {
    if (!date || !user?.uid) return;

    try {
      const res = await api.get("/stats/byDate", {
        params: { userId: user.uid, date },
      });

      // taskName を tasks から補完する
      const withNames: TaskSummary[] = res.data.taskSummary.map((t: TaskSummary) => ({
        ...t,
        taskName:
          tasks.find((task) => task._id === t.taskId)?.name || "不明なタスク",
      }));

      setSelectedDateStats({
        totalSeconds: res.data.totalSeconds,
        logCount: res.data.logCount || 0,
        taskSummary: withNames,
      });
    } catch (error) {
      console.error(error);
    }
  };
  // 日別の学習時間を集計
  const dailyDataObj = logs.reduce((acc: Record<string, number>, log) => {
    const day = log.startedAt.slice(0, 10); // "YYYY-MM-DD" に切り出し

    if (!acc[day]) acc[day] = 0;

    acc[day] += log.durationSeconds;
    return acc;
  }, {});

  const weeklyDataObj = logs.reduce((acc: Record<string, number>, log) => {
    const date = new Date(log.startedAt);
    const year = date.getFullYear();

    // 年初からの日数
    const start = new Date(year, 0, 1);
    const dayOfYear = Math.floor(
      (date.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );

    // 週番号計算
    const week = Math.ceil((dayOfYear + start.getDay() + 1) / 7);

    const key = `${year}-W${week}`;

    if (!acc[key]) acc[key] = 0;
    acc[key] += log.durationSeconds;

    return acc;
  }, {});

  const monthlyDataObj = logs.reduce((acc: Record<string, number>, log) => {
    const month = log.startedAt.slice(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = 0;
    acc[month] += log.durationSeconds;
    return acc;
  }, {});

  // ▼▼▼ ここから置き換える ▼▼▼

  // グラフ用データを mode によって切り替え
  let chartData: { date: string; minutes: number }[] = [];

  if (mode === "daily") {
    chartData = Object.entries(dailyDataObj).map(([date, sec]) => ({
      date,
      minutes: Math.round((sec as number) / 60),
    }));
  }

  if (mode === "weekly") {
    chartData = Object.entries(weeklyDataObj).map(([week, sec]) => ({
      date: week,
      minutes: Math.round((sec as number) / 60),
    }));
  }

  if (mode === "monthly") {
    chartData = Object.entries(monthlyDataObj).map(([month, sec]) => ({
      date: month,
      minutes: Math.round((sec as number) / 60),
    }));
  }

  // 日付順にソート
  chartData.sort((a, b) => a.date.localeCompare(b.date));

  // ▲▲▲ ここまで置き換える ▲▲▲

  const formatMinutes = (sec: number) => (sec / 60).toFixed(1); // 小数1位まで分表示

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1976d2 0%, white 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        {/* ページタイトル */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "white",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          📊 学習統計
        </h1>

        {!stats && (
          <p style={{ color: "white", textAlign: "center" }}>読み込み中...</p>
        )}

        {stats && (
          <>
            {/* 総計カード */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              }}
            >
              <h2 style={{ fontSize: "14px", color: "#04111eff", margin: "0 0 16px 0" }}>
                総学習時間
              </h2>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "700",
                  color: "#333",
                  marginBottom: "12px",
                }}
              >
                {formatMinutes(stats.totalSeconds)}
                <span style={{ fontSize: "20px", color: "#999", marginLeft: "8px" }}>
                  分
                </span>
              </div>
              <p style={{ margin: "8px 0", color: "#666", fontSize: "14px" }}>
                📝 記録回数：{stats.logCount} 回
              </p>
            </div>

            {todayStats && (
              <div>
                {/* 日付選択カード */}
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      color: "#04111eff",
                      margin: "0 0 16px 0",
                    }}
                  >
                    📅 日付を選択
                  </h3>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        border: "2px solid #e0e0e0",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => fetchStatsByDate(selectedDate)}
                      disabled={!selectedDate}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: selectedDate ? "#3a8ada" : "#ccc",
                        color: "white",
                        fontWeight: "600",
                        cursor: selectedDate ? "pointer" : "not-allowed",
                        fontSize: "13px",
                      }}
                    >
                      表示
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDateStats(null);
                        setSelectedDate("");
                      }}
                      disabled={selectedDate === "" && selectedDateStats === null}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background:
                          selectedDate !== "" || selectedDateStats !== null
                            ? "#abaaaaff"
                            : "#ccc",
                        color: "white",
                        fontWeight: "600",
                        cursor:
                          selectedDate !== "" || selectedDateStats !== null
                            ? "pointer"
                            : "not-allowed",
                        fontSize: "13px",
                      }}
                    >
                      今日に戻す
                    </button>
                  </div>
                </div>

                {/* 今日の学習 */}
                {selectedDateStats === null && todayStats && (
                  <div
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "20px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 12px 0" }}>
                      📅 今日の学習
                    </h3>
                    <p
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#333",
                        margin: "8px 0",
                      }}
                    >
                      {(todayStats.totalSeconds / 60).toFixed(1)}{" "}
                      <span style={{ fontSize: "14px", color: "#999" }}>分</span>
                    </p>

                    {todayStats.taskSummary?.length > 0 && (
                      <div style={{ marginTop: "16px", textAlign: "left" }}>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            marginBottom: "8px",
                          }}
                        >
                          タスク別
                        </p>
                        {todayStats.taskSummary.map((t) => (
                          <p
                            key={t.taskId}
                            style={{
                              margin: "6px 0",
                              color: "#333",
                              fontSize: "13px",
                            }}
                          >
                            • {t.taskName}：{(t.seconds / 60).toFixed(1)} 分
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 選択日の学習 */}
                {selectedDateStats !== null && (
                  <div
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "20px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 12px 0" }}>
                      📅 {selectedDate} の学習
                    </h3>
                    <p
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#1976d2",
                        margin: "8px 0",
                      }}
                    >
                      {(selectedDateStats.totalSeconds / 60).toFixed(1)}{" "}
                      <span style={{ fontSize: "14px", color: "#999" }}>分</span>
                    </p>
                    {selectedDateStats.taskSummary.length > 0 && (
                      <div style={{ marginTop: "16px", textAlign: "left" }}>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            marginBottom: "8px",
                          }}
                        >
                          タスク別
                        </p>
                        {selectedDateStats.taskSummary.map((t) => (
                          <p
                            key={t.taskId}
                            style={{
                              margin: "6px 0",
                              color: "#333",
                              fontSize: "13px",
                            }}
                          >
                            • {t.taskName}：{(t.seconds / 60).toFixed(1)} 分
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* タスク別統計 */}
            {stats.taskSummary && stats.taskSummary.length > 0 && (
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 12px 0" }}>
                  📈 タスク別の学習時間
                </h3>
                <div style={{ textAlign: "left" }}>
                  {stats.taskSummary.map((t) => (
                    <div
                      key={t.taskId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                        fontSize: "13px",
                      }}
                    >
                      <span>
                        {tasks.find((task) => task._id === t.taskId)?.name ||
                          "不明なタスク"}
                      </span>
                      <span style={{ fontSize:"17px"  ,fontWeight: "600", color: "#04111eff" }}>
                        {(t.seconds / 60).toFixed(1)} 分
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* グラフセクション */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0" }}>
                📊 学習時間推移
              </h3>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  onClick={() => setMode("daily")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: mode === "daily" ? "#3a8ada" : "#f0f0f0",
                    color: mode === "daily" ? "white" : "#666",
                    fontWeight: "600",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  日別
                </button>
                <button
                  onClick={() => setMode("weekly")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: mode === "weekly" ? "#3a8ada" : "#f0f0f0",
                    color: mode === "weekly" ? "white" : "#666",
                    fontWeight: "600",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  週別
                </button>
                <button
                  onClick={() => setMode("monthly")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: mode === "monthly" ? "#3a8ada" : "#f0f0f0",
                    color: mode === "monthly" ? "white" : "#666",
                    fontWeight: "600",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  月別
                </button>
              </div>
              <StatsGraph data={chartData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
