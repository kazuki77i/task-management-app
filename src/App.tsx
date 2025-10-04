import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { DataManager } from './components/DataManager';
import { AuthForm } from './components/AuthForm';
import { UserProfile } from './components/UserProfile';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const { currentUser, isLoading } = useAuth();

  // デバッグ情報
  console.log('App - currentUser:', currentUser, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <h2>読み込み中...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>TaskPad</h1>
            <p>シンプルなタスク管理アプリ</p>
          </div>
          <div className="header-right">
            {currentUser ? <UserProfile /> : null}
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {currentUser ? (
          <>
            <TaskForm />
            <TaskList />
            <DataManager />
          </>
        ) : (
          <AuthForm />
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2024 TaskPad. Built with React + TypeScript.</p>
      </footer>
    </div>
  );
}

export default App;
