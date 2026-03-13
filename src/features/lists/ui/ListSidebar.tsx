import { useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { useTodoStore } from '@features/todo/store/todoStore';

export function ListSidebar() {
  const {
    lists,
    activeListId,
    setActiveList,
    addList,
    updateList,
    deleteList,
  } = useTodoStore();

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  return (
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
  );
}
