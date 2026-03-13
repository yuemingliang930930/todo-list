import { Moon, Sun } from 'lucide-react';
import { useTodoStore } from '@features/todo/store/todoStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTodoStore();

  return (
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
  );
}
