import React from 'react';
import { CheckCircle2, Inbox } from 'lucide-react';
import type { Task } from '../types/todo';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  totalTasks: number;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  totalTasks,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state-card animate-fade-in">
        {totalTasks === 0 ? (
          <>
            <div className="empty-icon-wrapper">
              <Inbox size={34} />
            </div>
            <h3 className="empty-title">Your task list is empty</h3>
            <p className="empty-subtitle">
              Add a new task above or load the starter demo tasks to exoplore features.
            </p>
          </>
        ) : (
          <>
            <div className="empty-icon-wrapper">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="empty-title">No matching tasks found</h3>
            <p className="empty-subtitle">
              Try adjusting your search query or switching your active filters.
            </p>
          </>
        )}

        <style>{`
          .empty-state-card {
            background: var(--bg-secondary);
            border: 1px dashed var(--border-color);
            border-radius: 14px;
            padding: 3rem 1.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .empty-icon-wrapper {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            background: var(--accent-light);
            color: var(--accent-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
          }

          .empty-title {
            font-size: 1.05rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.35rem;
          }

          .empty-subtitle {
            font-size: 0.865rem;
            color: var(--text-secondary);
            max-width: 360px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};
