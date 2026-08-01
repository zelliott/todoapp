import { useState, useEffect, useMemo } from 'react';
import type {
  Category,
  FilterStatus,
  Priority,
  SortOption,
  Task,
  ThemeMode,
} from './types/todo';
import { INITIAL_TASKS } from './utils/constants';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';

const STORAGE_KEY_TASKS = 'taskflow_tasks_v1';
const STORAGE_KEY_THEME = 'taskflow_theme_v1';

export function App() {
  // Load initial theme
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  // Load initial tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to parse tasks from localStorage:', err);
    }
    return INITIAL_TASKS;
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt-desc');

  // TODO(feat): Persist active tasks and user theme preference to localStorage so state survives page refreshes.
  // Sync theme attribute to HTML document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Sync tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addTask = (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    category: Category;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: taskData.title,
      description: taskData.description,
      completed: false,
      priority: taskData.priority,
      category: taskData.category,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const resetDemo = () => {
    setTasks(INITIAL_TASKS);
  };

  // Compute filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q) || false;
          const matchCat = task.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priorityWeight: Record<Priority, number> = {
          high: 3,
          medium: 2,
          low: 1,
        };

        switch (sortBy) {
          case 'createdAt-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'createdAt-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'dueDate-asc': {
            // TODO(bug): Fix dueDate-asc sort comparator to return 0 when both tasks lack a due date to maintain Array.prototype.sort symmetry.
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
          }
          case 'priority-desc':
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          case 'alphabetical':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [tasks, statusFilter, categoryFilter, searchQuery, sortBy]);

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return {
      all: total,
      active: total - completed,
      completed,
    };
  }, [tasks]);

  return (
    <div className="app-shell">
      <main className="app-container">
        <Header
          totalTasks={counts.all}
          completedTasks={counts.completed}
          theme={theme}
          onToggleTheme={toggleTheme}
          onResetDemo={resetDemo}
          onClearCompleted={clearCompleted}
        />

        <TaskForm onAddTask={addTask} />

        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          counts={counts}
        />

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={toggleComplete}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          totalTasks={counts.all}
        />
      </main>

      <footer className="app-footer">
        <p>Built with Modern React & TypeScript • Saved locally</p>
      </footer>

      <style>{`
        .app-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1rem;
        }

        .app-container {
          width: 100%;
          max-width: 680px;
          flex: 1;
        }

        .app-footer {
          margin-top: 2.5rem;
          text-align: center;
          font-size: 0.785rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

export default App;
