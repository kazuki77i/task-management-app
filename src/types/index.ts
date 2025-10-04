export type Task = {
  id: string;          // 一意なID（uuid）
  title: string;       // タスクタイトル（必須）
  note?: string;       // 補足メモ（任意）
  done: boolean;       // 完了状態
  createdAt: number;   // 作成日時（UNIXタイム）
  due?: string;        // 期限（"YYYY-MM-DD"形式）
  userId: string;      // ユーザーID
};

export type User = {
  id: string;          // 一意なID（uuid）
  username: string;    // ユーザー名
  email: string;       // メールアドレス
  createdAt: number; // 作成日時（UNIXタイム）
};

export type FilterStatus = 'all' | 'pending' | 'completed';

export type SortOption = 'createdAt' | 'due' | 'title';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
};
