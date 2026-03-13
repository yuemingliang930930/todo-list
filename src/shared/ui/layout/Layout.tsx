import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { TodoList } from '@features/todo/ui/TodoList';
import { Header } from '@shared/ui/layout/Header';
import { SidebarShell } from '@shared/ui/layout/SidebarShell';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative z-40 h-full transition-transform duration-200`}
        >
          <SidebarShell />
        </div>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <TodoList />
      </div>
    </div>
  );
}
