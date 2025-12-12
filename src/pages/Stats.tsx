import { useEffect, useState } from "react";
import axios from "axios";
import StatsGraph from "../components/StatsGraph";

type StatsData = {
  totalSeconds: number;
  logCount: number;
  taskSummary: {
    taskId: string;
    taskName: string;
    seconds: number;
  }[];
};

type LogData = {
  startedAt: string;
  durationSeconds: number;
};

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [mode, setMode] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5001/stats", {
          params: { userId: "testuser" }, // ← 後で Firebase UID に置き換える
        });

        setStats(res.data);
      } catch (error) {
        console.error(error);
        alert("統計データの取得に失敗しました");
      }
    };

    fetchStats();
  }, []);
  // StudyLogs の取得
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5001/studyLogs", {
          params: { userId: "testuser" },
        });
        setLogs(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, []);
  // 日別の学習時間を集計
  const dailyDataObj = logs.reduce((acc: any, log) => {
    const day = log.startedAt.slice(0, 10); // "YYYY-MM-DD" に切り出し

    if (!acc[day]) acc[day] = 0;

    acc[day] += log.durationSeconds;
    return acc;
  }, {});

  const weeklyDataObj = logs.reduce((acc: any, log) => {
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

  const monthlyDataObj = logs.reduce((acc: any, log) => {
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

      {!stats && <p>読み込み中...</p>}

      {stats && (
        <>
          <p>総学習時間：{formatMinutes(stats.totalSeconds)} 分</p>
          <p>記録回数：{stats.logCount} 回</p>

          {/* ▼ タスク別統計 */}
          {stats.taskSummary && stats.taskSummary.length > 0 && (
            <div style={{ marginTop: "3px" }}>
              <h2 style={{ marginBottom: 0 }}>タスク別の学習時間</h2>

              {stats?.taskSummary && stats.taskSummary.length > 0 && (
                <div style={{ marginTop: "3px", textAlign: "left" }}>
                  
                  {stats.taskSummary.map((t) => (
                    <p key={t.taskId} style={{ margin: "4px 0" }}>
                      ・{t.taskId}：{(t.seconds / 60).toFixed(1)} 分
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
      <StatsGraph data={chartData} />
    </div>
  );
}
