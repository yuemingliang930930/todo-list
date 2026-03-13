export type { TodoItem } from '@entities/todo/types';
export type { TodoList } from '@entities/list/types';
export type { Tag } from '@entities/tag/types';

import type { TodoItem } from '@entities/todo/types';
import type { TodoList } from '@entities/list/types';
import type { Tag } from '@entities/tag/types';

export interface AppState {
  lists: TodoList[];
  items: TodoItem[];
  tags: Tag[];
  activeListId: string | null;
  theme: 'light' | 'dark';
}
