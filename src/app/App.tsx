import { useEffect } from 'react';
import { useTodoStore } from '@features/todo/store/todoStore';
import { Layout } from '@shared/ui/layout/Layout';

function App() {
  const { theme } = useTodoStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <Layout />;
}

export default App;
