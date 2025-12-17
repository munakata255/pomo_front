import "../styles/about.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">Pomodoro Timerについて</h1>

        <section className="about-card">
          <h2>📚 ポモドーロ・テクニックとは？</h2>
          <p className="about-text">
            ポモドーロ・テクニックは、時間管理手法の一つです。25分の作業時間と5分の休憩時間を1セットとして、集中力を高めながら効率的に作業を進めることができます。
          </p>
        </section>

        <section className="about-card">
          <h2>🎯 使い方</h2>
          <ol className="about-list">
            <li><strong>タスクを選択</strong>: Homeページでタスクを選択します</li>
            <li><strong>タイマーセットを選択</strong>: 作業時間、休憩時間、サイクル数を設定したタイマーセットを選択します</li>
            <li><strong>タイマー開始</strong>: Startボタンを押してタイマーを開始します</li>
            <li><strong>作業に集中</strong>: タイマーが鳴るまで集中して作業します</li>
            <li><strong>休憩</strong>: 作業時間が終わったら、休憩時間に入ります</li>
            <li><strong>繰り返し</strong>: 設定したサイクル数まで作業と休憩を繰り返します</li>
          </ol>
        </section>

        <section className="about-card">
          <h2>⚙️ 機能</h2>
          <ul className="about-list">
            <li><strong>カスタムタイマーセット</strong>: 作業時間、休憩時間、長い休憩時間、サイクル数を自由に設定できます</li>
            <li><strong>タスク管理</strong>: 複数のタスクを登録して管理できます</li>
            <li><strong>学習記録</strong>: 作業時間は自動的に記録され、Statsページで確認できます</li>
            <li><strong>グラフ表示</strong>: 日別の学習時間をグラフで可視化できます</li>
            <li><strong>音声通知</strong>: タイマー終了時に音で通知します</li>
            <li><strong>途中保存</strong>: 作業を中断する場合も、Saveボタンで記録を保存できます</li>
          </ul>
        </section>

        <section className="about-card">
          <h2>💡 ヒント</h2>
          <ul className="about-list">
            <li>作業中はできるだけ他のことに気を取られないようにしましょう</li>
            <li>休憩時間はしっかり休むことが大切です</li>
            <li>タイマーセットは自分に合った時間に調整しましょう</li>
            <li>Statsページで自分の学習パターンを分析してみましょう</li>
          </ul>
        </section>

        <section className="about-card about-cta">
          <h3>🚀 さあ、始めましょう！</h3>
          <p>効率的な時間管理で、あなたの目標を達成しましょう。</p>
        </section>
      </div>
    </div>
  );
}
