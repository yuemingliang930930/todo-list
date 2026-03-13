import { ListSidebar } from '@features/lists/ui/ListSidebar';
import { TagPanel } from '@features/tags/ui/TagPanel';

export function SidebarShell() {
  return (
    <aside className="w-64 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <ListSidebar />
        <TagPanel />
      </div>
    </aside>
  );
}
