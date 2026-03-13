import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { selectTodoListViewModel } from '@features/todo/model/selectors';
import { useTodoStore } from '@features/todo/store/todoStore';
import { TodoItem } from '@features/todo/ui/TodoItem';

export function TodoList() {
  const { items, activeListId, lists, addItem } = useTodoStore();
  const [newItemContent, setNewItemContent] = useState('');

  const { activeList, sortedItems, completedCount } = useMemo(
    () => selectTodoListViewModel({ lists, items, activeListId }),
    [lists, items, activeListId],
  );

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
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: activeList.color }} />
          <h2 className="text-xl font-semibold">{activeList.name}</h2>
          <span className="text-sm text-gray-500">
            ({completedCount}/{sortedItems.length})
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <TodoItem key={item.id} item={item} />
          ))}

          {sortedItems.length === 0 && <p className="text-center text-gray-500 py-8">暂无待办事项</p>}
        </div>
      </div>

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
