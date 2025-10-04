import { useRef, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';

export const DataManager = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { currentUser } = useAuth();
  const { exportTasks, importTasks, clearAllTasks, tasks } = useTasks(currentUser?.id);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importTasks(file);
      alert('データのインポートが完了しました！');
    } catch (error) {
      alert('インポートに失敗しました。ファイル形式を確認してください。');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    if (tasks.length === 0) {
      alert('エクスポートするタスクがありません。');
      return;
    }
    exportTasks();
  };

  const handleClearAll = () => {
    clearAllTasks();
  };

  if (!currentUser) {
    return (
      <div className="data-manager">
        <h3>データ管理</h3>
        <p className="login-prompt">データ管理機能を使用するにはログインしてください</p>
      </div>
    );
  }

  return (
    <div className="data-manager">
      <h3>データ管理</h3>
      <div className="data-actions">
        <button 
          onClick={handleExport} 
          className="export-button"
          disabled={tasks.length === 0}
        >
          📥 データをエクスポート
        </button>
        
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="import-button"
          disabled={isImporting}
        >
          📤 データをインポート
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        
        <button 
          onClick={handleClearAll} 
          className="clear-button"
          disabled={tasks.length === 0}
        >
          🗑️ すべて削除
        </button>
      </div>
      
      <div className="data-info">
        <p>現在のタスク数: <strong>{tasks.length}</strong></p>
        <p>完了済み: <strong>{tasks.filter(t => t.done).length}</strong></p>
        <p>未完了: <strong>{tasks.filter(t => !t.done).length}</strong></p>
      </div>
    </div>
  );
};
