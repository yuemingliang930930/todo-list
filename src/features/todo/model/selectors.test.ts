import { describe, expect, it } from 'vitest';
import { selectTodoListViewModel } from '@features/todo/model/selectors';

describe('selectTodoListViewModel', () => {
  it('returns empty view model when active list does not exist', () => {
    const viewModel = selectTodoListViewModel({
      lists: [{ id: 'l1', name: 'Work', color: '#111', createdAt: 1 }],
      items: [{
        id: 'i1',
        content: 'Task',
        completed: false,
        listId: 'l1',
        tags: [],
        createdAt: 10,
        updatedAt: 10,
      }],
      activeListId: 'missing',
    });

    expect(viewModel.activeList).toBeUndefined();
    expect(viewModel.completedCount).toBe(0);
    expect(viewModel.sortedItems).toEqual([]);
  });

  it('counts completed items only in active list', () => {
    const viewModel = selectTodoListViewModel({
      lists: [
        { id: 'l1', name: 'Work', color: '#111', createdAt: 1 },
        { id: 'l2', name: 'Life', color: '#222', createdAt: 2 },
      ],
      items: [
        {
          id: 'i1',
          content: 'Done in work',
          completed: true,
          listId: 'l1',
          tags: [],
          createdAt: 10,
          updatedAt: 10,
        },
        {
          id: 'i2',
          content: 'Todo in work',
          completed: false,
          listId: 'l1',
          tags: [],
          createdAt: 11,
          updatedAt: 11,
        },
        {
          id: 'i3',
          content: 'Done in life',
          completed: true,
          listId: 'l2',
          tags: [],
          createdAt: 12,
          updatedAt: 12,
        },
      ],
      activeListId: 'l1',
    });

    expect(viewModel.completedCount).toBe(1);
    expect(viewModel.sortedItems.map((item) => item.id)).toEqual(['i2', 'i1']);
  });

  it('sorts unfinished items first, then by createdAt desc', () => {
    const viewModel = selectTodoListViewModel({
      lists: [{ id: 'l1', name: 'Work', color: '#111', createdAt: 1 }],
      items: [
        {
          id: 'a',
          content: 'old unfinished',
          completed: false,
          listId: 'l1',
          tags: [],
          createdAt: 100,
          updatedAt: 100,
        },
        {
          id: 'b',
          content: 'new unfinished',
          completed: false,
          listId: 'l1',
          tags: [],
          createdAt: 200,
          updatedAt: 200,
        },
        {
          id: 'c',
          content: 'finished',
          completed: true,
          listId: 'l1',
          tags: [],
          createdAt: 300,
          updatedAt: 300,
        },
      ],
      activeListId: 'l1',
    });

    expect(viewModel.sortedItems.map((item) => item.id)).toEqual(['b', 'a', 'c']);
  });
});
