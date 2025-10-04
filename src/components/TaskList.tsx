import { useState, useMemo } from 'react';
import { FilterStatus, SortOption } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const { currentUser } = useAuth();
  const { tasks, deleteCompletedTasks } = useTasks(currentUser?.id);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // 検索フィルタ
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.note && task.note.toLowerCase().includes(query))
      );
    }

    // ステータスフィルタ
    if (filterStatus === 'pending') {
      filtered = filtered.filter(task => !task.done);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(task => task.done);
    }

    // ソート
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'due':
          if (!a.due && !b.due) return 0;
          if (!a.due) return 1;
          if (!b.due) return -1;
          return a.due.localeCompare(b.due);
        case 'createdAt':
        default:
          return b.createdAt - a.createdAt; // 新しい順
      }
    });

    return filtered;
  }, [tasks, searchQuery, filterStatus, sortBy]);

  const completedCount = tasks.filter(task => task.done).length;
  const pendingCount = tasks.filter(task => !task.done).length;

  if (!currentUser) {
    return (
      <div className="task-list-container">
        <div className="login-prompt">
          <h3>タスク一覧</h3>
          <p>タスクを表示するにはログインしてください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="controls">
        <div className="search-section">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タスクを検索..."
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <div className="filter-buttons">
            <button
              onClick={() => setFilterStatus('all')}
              className={filterStatus === 'all' ? 'active' : ''}
            >
              すべて ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={filterStatus === 'pending' ? 'active' : ''}
            >
              未完了 ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={filterStatus === 'completed' ? 'active' : ''}
            >
              完了済み ({completedCount})
            </button>
          </div>
          
          <div className="sort-section">
            <label htmlFor="sort-select">並び順:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="createdAt">作成日時</option>
              <option value="due">期限</option>
              <option value="title">タイトル</option>
            </select>
          </div>
        </div>
        
        {completedCount > 0 && (
          <div className="bulk-actions">
            <button onClick={deleteCompletedTasks} className="bulk-delete-button">
              完了済みを一括削除
            </button>
          </div>
        )}
      </div>

      <div className="task-list">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="empty-state">
            {searchQuery || filterStatus !== 'all' 
              ? '条件に一致するタスクがありません' 
              : 'タスクがありません。新しいタスクを追加してください。'
            }
          </div>
        ) : (
          filteredAndSortedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};
