import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, currentUser } = useAuth();

  // ログイン成功時にフォームを非表示にする
  useEffect(() => {
    if (currentUser) {
      setMessage('');
      setUsername('');
      setEmail('');
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      let result;
      if (isLogin) {
        result = login(username);
      } else {
        result = register(username, email);
      }

      if (result.success) {
        setMessage(result.message);
        // フォームをリセット
        setUsername('');
        setEmail('');
        // ログイン成功時は少し待ってからメッセージをクリア
        setTimeout(() => {
          setMessage('');
        }, 1000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setUsername('');
    setEmail('');
  };

  // デバッグ情報
  console.log('AuthForm - currentUser:', currentUser);

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>{isLogin ? 'ログイン' : '新規登録'}</h2>
        <p>{isLogin ? 'アカウントにログインしてください' : '新しいアカウントを作成してください'}</p>
        {/* デバッグ情報 */}
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          デバッグ: currentUser = {currentUser ? JSON.stringify(currentUser) : 'null'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        <div className="form-group">
          <label htmlFor="username">ユーザー名</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名を入力"
            required
            disabled={isLoading}
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              required
              disabled={isLoading}
            />
          </div>
        )}

        {message && (
          <div className={`message ${message.includes('成功') || message.includes('ログイン') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isLoading}
        >
          {isLoading ? '処理中...' : (isLogin ? 'ログイン' : '登録')}
        </button>

        <div className="auth-switch">
          <p>
            {isLogin ? 'アカウントをお持ちでない方は' : '既にアカウントをお持ちの方は'}
            <button 
              type="button" 
              onClick={toggleMode}
              className="switch-button"
              disabled={isLoading}
            >
              {isLogin ? '新規登録' : 'ログイン'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
