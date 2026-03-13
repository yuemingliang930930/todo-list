# Todo List App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete todo-list web application with multi-list groups, tags, theme switching, and local storage persistence.

**Architecture:** React SPA with Zustand for state management, Tailwind CSS for styling, localStorage for persistence. Component-based architecture with clear separation between UI and business logic.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Zustand + Lucide React

---

## Project Setup

### Task 1: Initialize Vite + React + TypeScript Project

**Step 1: Create Vite project**

Run:
```bash
cd D:/Code/todo-list
npm create vite@latest . -- --template react-ts
```

**Step 2: Install dependencies**

Run:
```bash
npm install
npm install zustand react-router-dom lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
```

**Step 3: Initialize Tailwind CSS**

Run:
```bash
npx tailwindcss init -p
```

**Step 4: Configure Tailwind**

Modify: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 5: Configure CSS**

Modify: `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: initialize Vite + React + TypeScript project with Tailwind CSS"
```

---

## Type Definitions

### Task 2: Define TypeScript Types

**Files:**
- Create: `src/types/index.ts`

**Step 1: Create types**

```typescript
export interface TodoItem {
  id: string;
  content: string;
  completed: boolean;
  listId: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TodoList {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface AppState {
  lists: TodoList[];
  items: TodoItem[];
  tags: Tag[];
  activeListId: string | null;
  theme: 'light' | 'dark';
}
```

**Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

## Storage Utility

### Task 3: Create localStorage Utility

**Files:**
- Create: `src/utils/storage.ts`

**Step 1: Create storage utility**

```typescript
const STORAGE_KEY = 'todo-list-data';

export interface StoredData {
  lists: import('../types').TodoList[];
  items: import('../types').TodoItem[];
  tags: import('../types').Tag[];
  activeListId: string | null;
  theme: 'light' | 'dark';
}

export const defaultData: StoredData = {
  lists: [
    { id: 'default', name: '我的待办', color: '#3B82F6', createdAt: Date.now() }
  ],
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
```

**Step 2: Commit**

```bash
git add src/utils/storage.ts
git commit -m "feat: add localStorage utility"
```

---

## State Management

### Task 4: Create Zustand Store

**Files:**
- Create: `src/stores/todoStore.ts`

**Step 1: Create store**

```typescript
import { create } from 'zustand';
import { loadData, saveData, generateId } from '../utils/storage';
import type { TodoItem, TodoList, Tag } from '../types';

interface TodoStore {
  lists: TodoList[];
  items: TodoItem[];
  tags: Tag[];
  activeListId: string | null;
  theme: 'light' | 'dark';

  // List actions
  addList: (name: string, color?: string) => void;
  updateList: (id: string, data: Partial<TodoList>) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;

  // Item actions
  addItem: (content: string, listId: string) => void;
  updateItem: (id: string, data: Partial<TodoItem>) => void;
  deleteItem: (id: string) => void;
  toggleItem: (id: string) => void;

  // Tag actions
  addTag: (name: string, color?: string) => void;
  deleteTag: (id: string) => void;

  // Theme
  toggleTheme: () => void;
}

export const useTodoStore = create<TodoStore>((set, get) => {
  const initialData = loadData();

  return {
    ...initialData,

    addList: (name, color = '#3B82F6') => {
      const newList: TodoList = {
        id: generateId(),
        name,
        color,
        createdAt: Date.now(),
      };
      set(state => {
        const newState = { lists: [...state.lists, newList] };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    updateList: (id, data) => {
      set(state => {
        const lists = state.lists.map(l => l.id === id ? { ...l, ...data } : l);
        const newState = { lists };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    deleteList: (id) => {
      set(state => {
        const lists = state.lists.filter(l => l.id !== id);
        const items = state.items.filter(i => i.listId !== id);
        const activeListId = state.activeListId === id
          ? (lists[0]?.id || null)
          : state.activeListId;
        const newState = { lists, items, activeListId };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    setActiveList: (id) => {
      set(state => {
        const newState = { activeListId: id };
        saveData({ ...state, ...newState });
        return newState;
      });
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
      set(state => {
        const newState = { items: [...state.items, newItem] };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    updateItem: (id, data) => {
      set(state => {
        const items = state.items.map(i =>
          i.id === id ? { ...i, ...data, updatedAt: Date.now() } : i
        );
        const newState = { items };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    deleteItem: (id) => {
      set(state => {
        const items = state.items.filter(i => i.id !== id);
        const newState = { items };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    toggleItem: (id) => {
      set(state => {
        const items = state.items.map(i =>
          i.id === id ? { ...i, completed: !i.completed, updatedAt: Date.now() } : i
        );
        const newState = { items };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    addTag: (name, color = '#10B981') => {
      const newTag: Tag = {
        id: generateId(),
        name,
        color,
      };
      set(state => {
        const newState = { tags: [...state.tags, newTag] };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    deleteTag: (id) => {
      set(state => {
        const tags = state.tags.filter(t => t.id !== id);
        const items = state.items.map(i => ({
          ...i,
          tags: i.tags.filter(tagId => tagId !== id),
        }));
        const newState = { tags, items };
        saveData({ ...state, ...newState });
        return newState;
      });
    },

    toggleTheme: () => {
      set(state => {
        const theme = state.theme === 'light' ? 'dark' : 'light';
        const newState = { theme };
        saveData({ ...state, ...newState });

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        return newState;
      });
    },
  };
});
```

**Step 2: Commit**

```bash
git add src/stores/todoStore.ts
git commit -m "feat: add Zustand store for state management"
```

---

## Components

### Task 5: Create Header Component

**Files:**
- Create: `src/components/Header.tsx`

**Step 1: Create Header**

```tsx
import { Moon, Sun, Search } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';

export function Header() {
  const { theme, toggleTheme } = useTodoStore();

  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        Todo List
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header component with theme toggle"
```

---

### Task 6: Create Sidebar Component

**Files:**
- Create: `src/components/Sidebar.tsx`

**Step 1: Create Sidebar**

```tsx
import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Tag } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';
import type { TodoList, Tag as TagType } from '../types';

export function Sidebar() {
  const {
    lists,
    tags,
    activeListId,
    setActiveList,
    addList,
    updateList,
    deleteList,
    addTag,
    deleteTag,
  } = useTodoStore();

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleAddList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
      setIsAddingList(false);
    }
  };

  const handleUpdateList = (id: string) => {
    if (editingName.trim()) {
      updateList(id, { name: editingName.trim() });
      setEditingListId(null);
      setEditingName('');
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  return (
    <aside className="w-64 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Lists */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            列表
          </h2>

          <div className="space-y-1">
            {lists.map((list) => (
              <div
                key={list.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeListId === list.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveList(list.id)}
              >
                {editingListId === list.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleUpdateList(list.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateList(list.id)}
                    className="flex-1 px-1 py-0.5 text-sm bg-white dark:bg-gray-600 border rounded"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="flex-1 text-sm truncate">{list.name}</span>
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingListId(list.id);
                          setEditingName(list.name);
                        }}
                        className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {lists.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteList(list.id);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {isAddingList ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                placeholder="列表名称"
                className="flex-1 px-2 py-1 text-sm rounded border dark:bg-gray-700 dark:border-gray-600"
                autoFocus
              />
              <button
                onClick={handleAddList}
                className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsAddingList(false);
                  setNewListName('');
                }}
                className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full"
            >
              <Plus className="w-4 h-4" />
              新建列表
            </button>
          )}
        </div>

        {/* Tags */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            标签
          </h2>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {isAddingTag ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="标签名称"
                className="flex-1 px-2 py-1 text-sm rounded border dark:bg-gray-700 dark:border-gray-600"
                autoFocus
              />
              <button
                onClick={handleAddTag}
                className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsAddingTag(false);
                  setNewTagName('');
                }}
                className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full"
            >
              <Plus className="w-4 h-4" />
              新建标签
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat: add Sidebar component with list and tag management"
```

---

### Task 7: Create TodoItem Component

**Files:**
- Create: `src/components/TodoItem.tsx`

**Step 1: Create TodoItem**

```tsx
import { useState } from 'react';
import { Trash2, Edit2, Check } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';
import type { TodoItem as TodoItemType } from '../types';

interface Props {
  item: TodoItemType;
}

export function TodoItem({ item }: Props) {
  const { toggleItem, deleteItem, updateItem, tags } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [showTagMenu, setShowTagMenu] = useState(false);

  const itemTags = tags.filter(t => item.tags.includes(t.id));

  const handleSave = () => {
    if (editContent.trim()) {
      updateItem(item.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const toggleTag = (tagId: string) => {
    const newTags = item.tags.includes(tagId)
      ? item.tags.filter(t => t !== tagId)
      : [...item.tags, tagId];
    updateItem(item.id, { tags: newTags });
  };

  return (
    <div className={`group flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all ${
      item.completed ? 'opacity-60' : ''
    }`}>
      <button
        onClick={() => toggleItem(item.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
        }`}
      >
        {item.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <p
            className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {item.content}
          </p>
        )}

        {itemTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {itemTags.map(tag => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="hidden group-hover:flex items-center gap-1">
        <button
          onClick={() => setShowTagMenu(!showTagMenu)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="管理标签"
        >
          <span className="text-xs">🏷️</span>
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Edit2 className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => deleteItem(item.id)}
          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {showTagMenu && (
        <div className="absolute right-0 top-full mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <p className="text-xs text-gray-500 mb-2">选择标签</p>
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-2 py-1 rounded-full text-xs ${
                  item.tags.includes(tag.id) ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: tag.color + '20',
                  color: tag.color,
                  ringColor: item.tags.includes(tag.id) ? tag.color : 'transparent'
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TodoItem.tsx
git commit -m "feat: add TodoItem component"
```

---

### Task 8: Create TodoList Component

**Files:**
- Create: `src/components/TodoList.tsx`

**Step 1: Create TodoList**

```tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const { items, activeListId, lists, addItem } = useTodoStore();
  const [newItemContent, setNewItemContent] = useState('');

  const activeList = lists.find(l => l.id === activeListId);
  const listItems = items.filter(i => i.listId === activeListId);
  const completedCount = listItems.filter(i => i.completed).length;

  const handleAddItem = () => {
    if (newItemContent.trim() && activeListId) {
      addItem(newItemContent.trim(), activeListId);
      setNewItemContent('');
    }
  };

  if (!activeList) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">请选择一个列表</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* List Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: activeList.color }}
          />
          <h2 className="text-xl font-semibold">{activeList.name}</h2>
          <span className="text-sm text-gray-500">
            ({completedCount}/{listItems.length})
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-2">
          {listItems
            .sort((a, b) => {
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              return b.createdAt - a.createdAt;
            })
            .map(item => (
              <TodoItem key={item.id} item={item} />
            ))}

          {listItems.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              暂无待办事项
            </p>
          )}
        </div>
      </div>

      {/* Add Item */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="添加新待办..."
            className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItemContent.trim()}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TodoList.tsx
git commit -m "feat: add TodoList component"
```

---

### Task 9: Create Main Layout

**Files:**
- Create: `src/components/Layout.tsx`

**Step 1: Create Layout**

```tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TodoList } from './TodoList';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative z-40 h-full transition-transform duration-200`}
        >
          <Sidebar />
        </div>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <TodoList />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/Layout.tsx
git commit -m "feat: add Layout component with responsive sidebar"
```

---

### Task 10: Update App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace App.tsx**

```tsx
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { useTodoStore } from './stores/todoStore';

function App() {
  const { theme } = useTodoStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <Layout />;
}

export default App;
```

**Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update App.tsx with theme initialization"
```

---

## Build and Test

### Task 11: Build and Verify

**Step 1: Install dependencies**

Run:
```bash
npm install
```

**Step 2: Start development server**

Run:
```bash
npm run dev
```

**Step 3: Verify in browser**

- Open http://localhost:5173
- Check that the app loads without errors
- Verify all features work:
  - [ ] Can create, edit, delete lists
  - [ ] Can create, edit, delete todo items
  - [ ] Can mark items as complete
  - [ ] Can add/remove tags from items
  - [ ] Theme toggle works
  - [ ] Data persists after refresh

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete todo-list app implementation"
```

---

## Plan complete

Two execution options:

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
