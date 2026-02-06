# 　Pomo Front

ポモドーロ・タイマーを中心とした学習支援Webアプリのフロントエンドです。  
ユーザーはタイマー管理、タスク管理、学習ログの可視化を行うことができます。

## 背景について
資格試験の学習時に、Webのポモドーロタイマーを使って勉強していました。
しかし、学習のモチベーションを保つためにどのくらい勉強したかを別途メモアプリで記録する必要があり、記録と計測が分断されていました。

既存のポモドーロ系Webアプリは、
・タイマー時間を自由に変更できない（当時）
・学習ログが残らず、後から振り返れない
など、自分の学習スタイルに合わせて使うには制約がありました。

そこで、計測（ポモドーロ）と記録（学習ログ）を一体化し、
柔軟なタイマー設定と、最小限の操作で学習量を可視化できる
Webアプリを開発しました。


## 🔗 デプロイURL
https://pomo-front.vercel.app

## 🛠 技術スタック
- React
- TypeScript
- Vite
- Firebase Authentication
- Axios
- CSS / HTML

## ✨ 主な機能
- Googleログイン / メールログイン（Firebase Auth）
- ポモドーロタイマー
- タイマーセットの作成・編集
- タスク管理
- 学習ログの記録
- 学習統計の可視化（今日・累計）

## 📡 バックエンド
本アプリは以下のバックエンドAPIと通信しています。

- API URL:  
  https://pomo-backend-j07c.onrender.com

## 🧑‍💻 ローカル開発方法

```bash
git clone https://github.com/munakata255/pomo_front.git
cd pomo_front
npm install
npm run dev
