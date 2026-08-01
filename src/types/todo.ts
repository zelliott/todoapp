export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Work' | 'Personal' | 'Health' | 'Shopping' | 'Study' | 'General';

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption =
  | 'createdAt-desc'
  | 'createdAt-asc'
  | 'dueDate-asc'
  | 'priority-desc'
  | 'alphabetical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  // TODO(feat): Extend Task interface to support optional subtasks array (subtasks?: { id: string; title: string; completed: boolean }[]) for checklists.
}

export type ThemeMode = 'dark' | 'light';
