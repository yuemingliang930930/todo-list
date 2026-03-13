import { Search } from 'lucide-react';
import { ThemeToggle } from '@features/theme/ui/ThemeToggle';

export function Header() {
  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Todo List</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
