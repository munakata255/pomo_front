import { useTimerContext } from "../../contexts/TimerContext";

export default function ButtonSettings() {
  const { buttonMode, setButtonMode } = useTimerContext();

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
        ボタン操作設定
      </h2>
      
      <div style={{ marginBottom: "30px" }}>
        <p style={{ marginBottom: "15px", fontSize: "16px", color: "#555" }}>
          タイマーの操作方法を選択してください
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              border: buttonMode === "buttons" ? "2px solid #1976d2" : "2px solid #e0e0e0",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: buttonMode === "buttons" ? "#f0f7ff" : "#fff",
              transition: "all 0.2s ease",
            }}
          >
            <input
              type="radio"
              name="buttonMode"
              value="buttons"
              checked={buttonMode === "buttons"}
              onChange={(e) => setButtonMode(e.target.value as "buttons" | "click")}
              style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
            />
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                通常モード
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Start、Stop、Reset、Saveの4つのボタンで操作します
              </div>
            </div>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              border: buttonMode === "click" ? "2px solid #1976d2" : "2px solid #e0e0e0",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: buttonMode === "click" ? "#f0f7ff" : "#fff",
              transition: "all 0.2s ease",
            }}
          >
            <input
              type="radio"
              name="buttonMode"
              value="click"
              checked={buttonMode === "click"}
              onChange={(e) => setButtonMode(e.target.value as "buttons" | "click")}
              style={{ marginRight: "12px", width: "20px", height: "20px", cursor: "pointer" }}
            />
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                クリックモード
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                タイマー画面全体をクリックでStart/Stopを切り替え。Reset/Saveボタンのみ表示されます
              </div>
            </div>
          </label>
        </div>
      </div>

      <div
        style={{
          padding: "15px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "8px",
          fontSize: "14px",
          color: "#856404",
        }}
      >
        💡 ヒント: クリックモードでは、タイマー表示エリア全体をクリックすることで素早く開始・停止ができます
      </div>
    </div>
  );
}
