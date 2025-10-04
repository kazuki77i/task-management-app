import { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNote, setEditNote] = useState(task.note || '');
  const [editDue, setEditDue] = useState(task.due || '');
  
  const { currentUser } = useAuth();
  const { updateTask, deleteTask, toggleTask } = useTasks(currentUser?.id);

  const handleSave = () => {
    if (editTitle.trim()) {
      updateTask(task.id, {
        title: editTitle.trim(),
        note: editNote.trim() || undefined,
        due: editDue || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditNote(task.note || '');
    setEditDue(task.due || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isOverdue = task.due && !task.done && dayjs(task.due).isBefore(dayjs(), 'day');

  return (
    <div className={`task-item ${task.done ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => toggleTask(task.id)}
          className="task-checkbox"
        />
        
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="edit-title"
              autoFocus
            />
            <input
              type="text"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メモ"
              className="edit-note"
            />
            <input
              type="date"
              value={editDue}
              onChange={(e) => setEditDue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="edit-due"
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="save-button">保存</button>
              <button onClick={handleCancel} className="cancel-button">キャンセル</button>
            </div>
          </div>
        ) : (
          <div className="task-content">
            <div className="task-title">{task.title}</div>
            {task.note && <div className="task-note">{task.note}</div>}
            {task.due && (
              <div className={`task-due ${isOverdue ? 'overdue' : ''}`}>
                期限: {dayjs(task.due).format('YYYY/MM/DD')}
              </div>
            )}
            <div className="task-date">
              作成: {dayjs(task.createdAt).format('YYYY/MM/DD HH:mm')}
            </div>
          </div>
        )}
      </div>
      
      {!isEditing && (
        <div className="task-actions">
          <button onClick={() => setIsEditing(true)} className="edit-button">
            編集
          </button>
          <button onClick={() => deleteTask(task.id)} className="delete-button">
            削除
          </button>
        </div>
      )}
    </div>
  );
};
