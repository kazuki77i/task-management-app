import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';

export const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [due, setDue] = useState('');
  const { currentUser } = useAuth();
  const { addTask } = useTasks(currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && currentUser) {
      addTask(title, note || undefined, due || undefined);
      setTitle('');
      setNote('');
      setDue('');
    }
  };

  if (!currentUser) {
    return (
      <div className="task-form">
        <p className="login-prompt">タスクを追加するにはログインしてください</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="task-input"
          required
        />
        <button type="submit" className="add-button">
          追加
        </button>
      </div>
      
      <div className="form-options">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="メモ（任意）"
          className="note-input"
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="due-input"
        />
      </div>
    </form>
  );
};
