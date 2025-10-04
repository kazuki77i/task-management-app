import { useState, useEffect } from 'react';
import { User, AuthUser } from '../types';
import { v4 as uuidv4 } from 'uuid';

const USERS_STORAGE_KEY = 'taskpad:users:v1';
const CURRENT_USER_KEY = 'taskpad:current-user:v1';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 現在のユーザー情報を読み込み
  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse current user:', error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // ユーザー登録
  const register = (username: string, email: string): { success: boolean; message: string } => {
    // バリデーション
    if (!username.trim()) {
      return { success: false, message: 'ユーザー名を入力してください' };
    }
    if (!email.trim()) {
      return { success: false, message: 'メールアドレスを入力してください' };
    }
    if (!email.includes('@')) {
      return { success: false, message: '有効なメールアドレスを入力してください' };
    }

    // 既存ユーザーを取得
    const existingUsers = getUsers();
    
    // 重複チェック
    if (existingUsers.some(user => user.username === username.trim())) {
      return { success: false, message: 'このユーザー名は既に使用されています' };
    }
    if (existingUsers.some(user => user.email === email.trim())) {
      return { success: false, message: 'このメールアドレスは既に登録されています' };
    }

    // 新しいユーザーを作成
    const newUser: User = {
      id: uuidv4(),
      username: username.trim(),
      email: email.trim(),
      createdAt: Date.now(),
    };

    // ユーザーを保存
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // ログイン状態にする
    const authUser: AuthUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    setCurrentUser(authUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));

    return { success: true, message: 'アカウントが作成されました' };
  };

  // ログイン
  const login = (username: string): { success: boolean; message: string } => {
    if (!username.trim()) {
      return { success: false, message: 'ユーザー名を入力してください' };
    }

    const users = getUsers();
    const user = users.find(u => u.username === username.trim());

    if (!user) {
      return { success: false, message: 'ユーザーが見つかりません' };
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    setCurrentUser(authUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));

    return { success: true, message: 'ログインしました' };
  };

  // ログアウト
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  // ユーザー一覧を取得
  const getUsers = (): User[] => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (error) {
        console.error('Failed to parse users:', error);
        return [];
      }
    }
    return [];
  };

  // ユーザー削除（管理者機能）
  const deleteUser = (userId: string): boolean => {
    const users = getUsers();
    const updatedUsers = users.filter(user => user.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    // 現在のユーザーが削除された場合はログアウト
    if (currentUser?.id === userId) {
      logout();
    }

    return true;
  };

  return {
    currentUser,
    isLoading,
    register,
    login,
    logout,
    getUsers,
    deleteUser,
  };
};
