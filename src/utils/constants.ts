import type { Category, Priority, Task } from '../types/todo';

// TODO(a11y): Add separate dark-mode color variants for CATEGORY_COLORS so low-light text meets WCAG AA contrast standards.
export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  Work: {
    bg: 'rgba(59, 130, 246, 0.12)',
    text: '#2563eb',
    border: 'rgba(59, 130, 246, 0.25)',
  },
  Personal: {
    bg: 'rgba(168, 85, 247, 0.12)',
    text: '#9333ea',
    border: 'rgba(168, 85, 247, 0.25)',
  },
  Health: {
    bg: 'rgba(16, 185, 129, 0.12)',
    text: '#059669',
    border: 'rgba(16, 185, 129, 0.25)',
  },
  Shopping: {
    bg: 'rgba(245, 158, 11, 0.12)',
    text: '#d97706',
    border: 'rgba(245, 158, 11, 0.25)',
  },
  Study: {
    bg: 'rgba(236, 72, 153, 0.12)',
    text: '#db2777',
    border: 'rgba(236, 72, 153, 0.25)',
  },
  General: {
    bg: 'rgba(100, 116, 139, 0.12)',
    text: '#475569',
    border: 'rgba(100, 116, 139, 0.25)',
  },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string; dot: string }
> = {
  high: {
    label: 'High Priority',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    dot: '#ef4444',
  },
  medium: {
    label: 'Medium Priority',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    dot: '#f59e0b',
  },
  low: {
    label: 'Low Priority',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    dot: '#10b981',
  },
};

export const CATEGORIES: Category[] = [
  'Work',
  'Personal',
  'Health',
  'Shopping',
  'Study',
  'General',
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review production deployment pipeline & logs',
    description: 'Verify error rates across staging and production clusters before evening release.',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'task-2',
    title: '30-minute cardio & core workout session',
    description: 'Target 140 BPM average heart rate.',
    completed: true,
    priority: 'medium',
    category: 'Health',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Read system architecture & distributed design patterns chapter',
    description: 'Focus on eventual consistency vs linearizability trade-offs.',
    completed: false,
    priority: 'medium',
    category: 'Study',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Order ergonomics monitor arm & cable management kit',
    completed: false,
    priority: 'low',
    category: 'Shopping',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];
