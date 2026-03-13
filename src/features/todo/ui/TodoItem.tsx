import { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, Tag as TagIcon } from 'lucide-react';
import type { TodoItem as TodoItemType } from '@entities/todo/types';
import { useTodoStore } from '@features/todo/store/todoStore';

interface Props {
  item: TodoItemType;
}

export function TodoItem({ item }: Props) {
  const { toggleItem, deleteItem, updateItem, tags } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const tagMenuRef = useRef<HTMLDivElement>(null);

  const itemTags = tags.filter((t) => item.tags.includes(t.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagMenuRef.current && !tagMenuRef.current.contains(event.target as Node)) {
        setShowTagMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    if (editContent.trim()) {
      updateItem(item.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const toggleTag = (tagId: string) => {
    const newTags = item.tags.includes(tagId)
      ? item.tags.filter((t) => t !== tagId)
      : [...item.tags, tagId];
    updateItem(item.id, { tags: newTags });
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all ${
        item.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => toggleItem(item.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
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
            {itemTags.map((tag) => (
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

      <div className="hidden group-hover:flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => setShowTagMenu(!showTagMenu)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="管理标签"
        >
          <TagIcon className="w-4 h-4 text-gray-500" />
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
        <div
          ref={tagMenuRef}
          className="absolute right-0 top-full mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]"
        >
          <p className="text-xs text-gray-500 mb-2">选择标签</p>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-2 py-1 rounded-full text-xs ${
                  item.tags.includes(tag.id) ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: tag.color + '20',
                  color: tag.color,
                }}
              >
                {item.tags.includes(tag.id) && <Check className="w-3 h-3 inline mr-1" />}
                {tag.name}
              </button>
            ))}
            {tags.length === 0 && <p className="text-xs text-gray-400">暂无标签</p>}
          </div>
        </div>
      )}
    </div>
  );
}
