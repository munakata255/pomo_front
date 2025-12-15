import { useEffect, useState } from "react";
import axios from "axios";
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
        const res = await axios.get("http://localhost:5001/tasks", {
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
        const res = await axios.get("http://localhost:5001/stats", {
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
        const res = await axios.get("http://localhost:5001/studyLogs", {
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
        const res = await axios.get("http://localhost:5001/stats/today", {
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
      const res = await axios.get("http://localhost:5001/stats/byDate", {
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
    <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
      <h1>学習統計</h1>
      {!stats && <p>読み込み中...</p>}

      {stats && (
        <>
          <p>総学習時間：{formatMinutes(stats.totalSeconds)} 分</p>
          <p>記録回数：{stats.logCount} 回</p>

          {todayStats && (
            <div style={{ marginTop: "20px" }}>
              <div style={{ marginTop: "20px" }}>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />

                <button
                  onClick={() => fetchStatsByDate(selectedDate)}
                  disabled={!selectedDate}
                  style={{ marginLeft: "6px" }}
                >
                  この日を見る
                </button>

                <button
                  onClick={() => {
                    setSelectedDateStats(null);
                    setSelectedDate("");
                  }}
                  disabled={selectedDate === "" && selectedDateStats === null}
                  style={{ marginLeft: "6px" }}
                >
                  今日に戻る
                </button>
                {/* ▼ 今日の学習（選択日の結果がまだない場合だけ表示） */}
                {selectedDateStats === null && todayStats && (
                  <div style={{ marginTop: "20px" }}>
                    <h2>📅 今日の学習</h2>
                    <p>合計：{(todayStats.totalSeconds / 60).toFixed(1)} 分</p>

                    {/* タスク別（ある時だけ） */}
                    {todayStats.taskSummary?.length > 0 && (
                      <>
                        <h3 style={{ marginTop: "10px" }}>タスク別</h3>
                        {todayStats.taskSummary.map((t) => (
                          <p key={t.taskId}>
                            ・{t.taskName}：{(t.seconds / 60).toFixed(1)} 分
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* ▼ 選択日の学習（APIを押してデータが来た時だけ表示） */}
                {selectedDateStats !== null && (
                  <div style={{ marginTop: "20px" }}>
                    <h2>📅 {selectedDate} の学習</h2>
                    <p>
                      合計：{(selectedDateStats.totalSeconds / 60).toFixed(1)}{" "}
                      分
                    </p>
                    {selectedDateStats.taskSummary.length > 0 && (
                      <>
                        <h3 style={{ marginTop: "10px" }}>タスク別</h3>
                        {selectedDateStats.taskSummary.map((t) => (
                          <p key={t.taskId}>
                            ・{t.taskName}：{(t.seconds / 60).toFixed(1)} 分
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ▼ タスク別統計 */}
          {stats.taskSummary && stats.taskSummary.length > 0 && (
            <div style={{ marginTop: "3px" }}>
              <h2 style={{ marginBottom: 0 }}>タスク別の学習時間</h2>

              {stats?.taskSummary && stats.taskSummary.length > 0 && (
                <div style={{ marginTop: "3px", textAlign: "left" }}>
                  {stats.taskSummary.map((t) => (
                    <p key={t.taskId} style={{ margin: "4px 0" }}>
                      ・
                      {tasks.find((task) => task._id === t.taskId)?.name ||
                        "不明なタスク"}
                      ：{(t.seconds / 60).toFixed(1)} 分
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <h2>日別学習時間</h2>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setMode("daily")}>日別</button>
        <button
          onClick={() => setMode("weekly")}
          style={{ marginLeft: "10px" }}
        >
          週別
        </button>
        <button
          onClick={() => setMode("monthly")}
          style={{ marginLeft: "10px" }}
        >
          月別
        </button>
      </div>
      <StatsGraph data={chartData} />
    </div>
  );
}
