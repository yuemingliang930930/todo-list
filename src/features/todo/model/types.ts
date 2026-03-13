import type { TodoItem } from '@entities/todo/types';
import type { TodoList } from '@entities/list/types';
import type { Tag } from '@entities/tag/types';

export type ThemeMode = 'light' | 'dark';

export interface TodoState {
  lists: TodoList[];
  items: TodoItem[];
  tags: Tag[];
  activeListId: string | null;
  theme: ThemeMode;
}

export interface TodoActions {
  addList: (name: string, color?: string) => void;
  updateList: (id: string, data: Partial<TodoList>) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;

  addItem: (content: string, listId: string) => void;
  updateItem: (id: string, data: Partial<TodoItem>) => void;
  deleteItem: (id: string) => void;
  toggleItem: (id: string) => void;

  addTag: (name: string, color?: string) => void;
  deleteTag: (id: string) => void;

  toggleTheme: () => void;
}

export type TodoStore = TodoState & TodoActions;
