type Props = {
  selectedTask: string;
  onSelectTask: (taskId: string) => void;
};

export default function TaskSelect({ selectedTask, onSelectTask }: Props) {
  return (
    <div style={{ margin: "20px 0" }}>
      <label>Task: </label>
      <select
        value={selectedTask}
        onChange={(e) => onSelectTask(e.target.value)}
      >
        <option value="">選択してください</option>
        <option value="task1">就活</option>
        <option value="task2">英語</option>
        <option value="task3">コーディング</option>
      </select>
    </div>
  );
}
