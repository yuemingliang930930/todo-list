import { create } from 'zustand';
import type { TodoItem } from '@entities/todo/types';
import type { TodoList } from '@entities/list/types';
import type { Tag } from '@entities/tag/types';
import type { ThemeMode, TodoState, TodoStore } from '@features/todo/model/types';
import { generateId, loadData, saveData } from '@shared/lib/storage/localStorage';
import type { StoredData } from '@shared/lib/storage/localStorage';

const toStoredData = (state: TodoState): StoredData => ({
  lists: state.lists,
  items: state.items,
  tags: state.tags,
  activeListId: state.activeListId,
  theme: state.theme,
});

export const useTodoStore = create<TodoStore>((set) => {
  const initialData = loadData();

  const setWithPersist = (updater: (state: TodoStore) => Partial<TodoState>) => {
    set((state) => {
      const patch = updater(state);
      const nextStoredData: StoredData = { ...toStoredData(state), ...patch };
      saveData(nextStoredData);
      return patch;
    });
  };

  return {
    ...initialData,

    addList: (name, color = '#3B82F6') => {
      const newList: TodoList = {
        id: generateId(),
        name,
        color,
        createdAt: Date.now(),
      };

      setWithPersist((state) => ({
        lists: [...state.lists, newList],
      }));
    },

    updateList: (id, data) => {
      setWithPersist((state) => ({
        lists: state.lists.map((list) => (list.id === id ? { ...list, ...data } : list)),
      }));
    },

    deleteList: (id) => {
      setWithPersist((state) => {
        const lists = state.lists.filter((list) => list.id !== id);
        const items = state.items.filter((item) => item.listId !== id);
        const activeListId = state.activeListId === id ? lists[0]?.id || null : state.activeListId;

        return { lists, items, activeListId };
      });
    },

    setActiveList: (id) => {
      setWithPersist(() => ({ activeListId: id }));
    },

    addItem: (content, listId) => {
      const newItem: TodoItem = {
        id: generateId(),
        content,
        completed: false,
        listId,
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setWithPersist((state) => ({
        items: [...state.items, newItem],
      }));
    },

    updateItem: (id, data) => {
      setWithPersist((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...data, updatedAt: Date.now() } : item,
        ),
      }));
    },

    deleteItem: (id) => {
      setWithPersist((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    },

    toggleItem: (id) => {
      setWithPersist((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, completed: !item.completed, updatedAt: Date.now() } : item,
        ),
      }));
    },

    addTag: (name, color = '#10B981') => {
      const newTag: Tag = {
        id: generateId(),
        name,
        color,
      };

      setWithPersist((state) => ({
        tags: [...state.tags, newTag],
      }));
    },

    deleteTag: (id) => {
      setWithPersist((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        items: state.items.map((item) => ({
          ...item,
          tags: item.tags.filter((tagId) => tagId !== id),
        })),
      }));
    },

    toggleTheme: () => {
      setWithPersist((state) => {
        const theme: ThemeMode = state.theme === 'light' ? 'dark' : 'light';

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        return { theme };
      });
    },
  };
});
