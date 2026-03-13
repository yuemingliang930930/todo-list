import type { TodoItem } from '@entities/todo/types';
import type { TodoList } from '@entities/list/types';
import type { TodoState } from '@features/todo/model/types';

export interface TodoListViewModel {
  activeList: TodoList | undefined;
  sortedItems: TodoItem[];
  completedCount: number;
}

type TodoListSelectorInput = Pick<TodoState, 'lists' | 'items' | 'activeListId'>;

export const selectTodoListViewModel = ({
  lists,
  items,
  activeListId,
}: TodoListSelectorInput): TodoListViewModel => {
  const activeList = lists.find((list) => list.id === activeListId);
  const listItems = items.filter((item) => item.listId === activeListId);

  return {
    activeList,
    completedCount: listItems.filter((item) => item.completed).length,
    sortedItems: [...listItems].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.createdAt - a.createdAt;
    }),
  };
};
