import { useAuth } from '../hooks/useAuth';

export const UserProfile = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">
          {currentUser.username.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <h3>{currentUser.username}</h3>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <button onClick={logout} className="logout-button">
        ログアウト
      </button>
    </div>
  );
};
