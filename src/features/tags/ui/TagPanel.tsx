import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTodoStore } from '@features/todo/store/todoStore';

export function TagPanel() {
  const { tags, addTag, deleteTag } = useTodoStore();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  return (
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
            <button onClick={() => deleteTag(tag.id)} className="hover:opacity-70">
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
  );
}
