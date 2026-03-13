import type { TodoItem } from '@entities/todo/types';
import type { TodoList } from '@entities/list/types';
import type { Tag } from '@entities/tag/types';

const STORAGE_KEY = 'todo-list-data';

export interface StoredData {
  lists: TodoList[];
  items: TodoItem[];
  tags: Tag[];
  activeListId: string | null;
  theme: 'light' | 'dark';
}

export const defaultData: StoredData = {
  lists: [{ id: 'default', name: '我的待办', color: '#3B82F6', createdAt: Date.now() }],
  items: [],
  tags: [],
  activeListId: 'default',
  theme: 'light',
};

export const loadData = (): StoredData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load data', e);
  }
  return defaultData;
};

export const saveData = (data: StoredData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
