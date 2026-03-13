import { beforeEach, describe, expect, it, vi } from 'vitest';

type DataShape = {
  lists?: unknown;
  items?: unknown;
  tags?: unknown;
  activeListId?: unknown;
  theme?: unknown;
};

function createLocalStorageMock(initialData?: DataShape) {
  const store = new Map<string, string>();
  if (initialData) {
    store.set('todo-list-data', JSON.stringify(initialData));
  }

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };
}

function createDocumentMock() {
  return {
    documentElement: {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    },
  };
}

describe('todoStore actions', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('deleteList removes the list, its items, and switches active list when needed', async () => {
    const localStorageMock = createLocalStorageMock({
      lists: [
        { id: 'l1', name: 'Work', color: '#111', createdAt: 1 },
        { id: 'l2', name: 'Life', color: '#222', createdAt: 2 },
      ],
      items: [
        {
          id: 'i1',
          content: 'task 1',
          completed: false,
          listId: 'l1',
          tags: [],
          createdAt: 10,
          updatedAt: 10,
        },
        {
          id: 'i2',
          content: 'task 2',
          completed: false,
          listId: 'l2',
          tags: [],
          createdAt: 11,
          updatedAt: 11,
        },
      ],
      tags: [],
      activeListId: 'l1',
      theme: 'light',
    });

    vi.stubGlobal('localStorage', localStorageMock);

    const { useTodoStore } = await import('@features/todo/store/todoStore');

    useTodoStore.getState().deleteList('l1');

    const state = useTodoStore.getState();
    expect(state.lists.map((list) => list.id)).toEqual(['l2']);
    expect(state.items.map((item) => item.id)).toEqual(['i2']);
    expect(state.activeListId).toBe('l2');
  });

  it('deleteTag removes tag and detaches it from all items', async () => {
    const localStorageMock = createLocalStorageMock({
      lists: [{ id: 'l1', name: 'Work', color: '#111', createdAt: 1 }],
      items: [
        {
          id: 'i1',
          content: 'task 1',
          completed: false,
          listId: 'l1',
          tags: ['t1', 't2'],
          createdAt: 10,
          updatedAt: 10,
        },
        {
          id: 'i2',
          content: 'task 2',
          completed: false,
          listId: 'l1',
          tags: ['t1'],
          createdAt: 11,
          updatedAt: 11,
        },
      ],
      tags: [
        { id: 't1', name: 'Urgent', color: '#f00' },
        { id: 't2', name: 'Home', color: '#0f0' },
      ],
      activeListId: 'l1',
      theme: 'light',
    });

    vi.stubGlobal('localStorage', localStorageMock);

    const { useTodoStore } = await import('@features/todo/store/todoStore');

    useTodoStore.getState().deleteTag('t1');

    const state = useTodoStore.getState();
    expect(state.tags.map((tag) => tag.id)).toEqual(['t2']);
    expect(state.items.find((item) => item.id === 'i1')?.tags).toEqual(['t2']);
    expect(state.items.find((item) => item.id === 'i2')?.tags).toEqual([]);
  });

  it('toggleTheme updates theme and toggles dark class on documentElement', async () => {
    const localStorageMock = createLocalStorageMock({
      lists: [{ id: 'l1', name: 'Work', color: '#111', createdAt: 1 }],
      items: [],
      tags: [],
      activeListId: 'l1',
      theme: 'light',
    });
    const documentMock = createDocumentMock();

    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('document', documentMock);

    const { useTodoStore } = await import('@features/todo/store/todoStore');

    useTodoStore.getState().toggleTheme();
    expect(useTodoStore.getState().theme).toBe('dark');
    expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith('dark');

    useTodoStore.getState().toggleTheme();
    expect(useTodoStore.getState().theme).toBe('light');
    expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith('dark');
  });

  it('updateItem updates content and refreshes updatedAt timestamp', async () => {
    const localStorageMock = createLocalStorageMock({
      lists: [{ id: 'l1', name: 'Work', color: '#111', createdAt: 1 }],
      items: [
        {
          id: 'i1',
          content: 'old content',
          completed: false,
          listId: 'l1',
          tags: [],
          createdAt: 10,
          updatedAt: 10,
        },
      ],
      tags: [],
      activeListId: 'l1',
      theme: 'light',
    });

    vi.stubGlobal('localStorage', localStorageMock);
    vi.spyOn(Date, 'now').mockReturnValue(999);

    const { useTodoStore } = await import('@features/todo/store/todoStore');

    useTodoStore.getState().updateItem('i1', { content: 'new content' });

    const updated = useTodoStore.getState().items.find((item) => item.id === 'i1');
    expect(updated?.content).toBe('new content');
    expect(updated?.updatedAt).toBe(999);
  });
});
