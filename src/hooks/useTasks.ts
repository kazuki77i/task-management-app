import { useState, useEffect } from 'react';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'taskpad:tasks:v1';

export const useTasks = (userId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // localStorageからデータを読み込み
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const allTasks = JSON.parse(savedTasks);
        const userTasks = allTasks.filter((task: Task) => task.userId === userId);
        setTasks(userTasks);
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
        setTasks([]);
      }
    }
  }, [userId]);

  // tasksが変更されたらlocalStorageに保存
  useEffect(() => {
    if (!userId) return;

    const savedTasks = localStorage.getItem(STORAGE_KEY);
    let allTasks: Task[] = [];
    
    if (savedTasks) {
      try {
        allTasks = JSON.parse(savedTasks);
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
        allTasks = [];
      }
    }

    // 現在のユーザーのタスクを更新
    const otherUsersTasks = allTasks.filter(task => task.userId !== userId);
    const updatedTasks = [...otherUsersTasks, ...tasks];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
  }, [tasks, userId]);

  const addTask = (title: string, note?: string, due?: string) => {
    if (!userId) return;

    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      note: note?.trim(),
      done: false,
      createdAt: Date.now(),
      due: due,
      userId: userId,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  const deleteCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.done));
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskpad-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importTasks = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedTasks)) {
            setTasks(importedTasks);
            resolve();
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const clearAllTasks = () => {
    if (window.confirm('すべてのタスクを削除しますか？この操作は元に戻せません。')) {
      setTasks([]);
    }
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    deleteCompletedTasks,
    exportTasks,
    importTasks,
    clearAllTasks,
  };
};
