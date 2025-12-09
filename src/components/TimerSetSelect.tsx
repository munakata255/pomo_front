type Props = {
  selectedTimerSet: string;
  onSelectTimerSet: (setId: string) => void;
};

export default function TimerSetSelect({
  selectedTimerSet,
  onSelectTimerSet,
}: Props) {
  return (
    <div style={{ margin: "20px 0" }}>
      <label>Timer Set: </label>
      <select
        value={selectedTimerSet}
        onChange={(e) => onSelectTimerSet(e.target.value)}
      >
        <option value="">選択してください</option>
        <option value="set1">25分 + 5分</option>
        <option value="set2">50分 + 10分</option>
        <option value="set3">90分 + 20分</option>
      </select>
    </div>
  );
}
