import React, { useState } from 'react';
import {
  Check,
  Calendar,
  Pencil,
  Trash2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';
import type { Category, Priority, Task } from '../types/todo';
import { CATEGORIES, CATEGORY_COLORS, PRIORITY_CONFIG } from '../utils/constants';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editCategory, setEditCategory] = useState<Category>(task.category);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const categoryColor = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.General;
  const priorityCfg = PRIORITY_CONFIG[task.prio];

  const isOverdue =
    !task.completed &&
    task.dueDate &&
    new Date(task.dueDate + 'T23:59:59') < new Date();

  // TODO(bug): Replace toISOString() in isDueToday with local timezone YYYY-MM-DD string to prevent day-shifting in non-UTC timezones.
  const isDueToday =
    !task.completed &&
    task.dueDate &&
    task.dueDate === new Date().toISOString().split('T')[0];

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;

    onUpdateTask(task.id, {
      title: trimmed,
      description: editDescription.trim() || undefined,
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  return (
    <div
      className={`task-item-card ${task.completed ? 'completed' : ''} ${
        isEditing ? 'editing' : ''
      }`}
    >
      {!isEditing ? (
        <div className="task-view-row">
          {/* TODO(ui): Add custom visual checkbox with animated checkmark pop and accessible aria-label. */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && <Check size={14} className="animate-check" />}
          </button>

          <div className="task-content">
            <div className="task-title-row">
              <span className="task-title">{task.title}</span>
            </div>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta-row">
              <span
                className="badge-category"
                style={{
                  backgroundColor: categoryColor.bg,
                  color: categoryColor.text,
                  borderColor: categoryColor.border,
                }}
              >
                {task.category}
              </span>

              <span
                className="badge-priority"
                style={{
                  backgroundColor: priorityCfg.bg,
                  color: priorityCfg.color,
                }}
              >
                <span
                  className="priority-dot"
                  style={{ backgroundColor: priorityCfg.dot }}
                />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              {task.dueDate && (
                <span
                  className={`badge-due-date ${
                    isOverdue ? 'overdue' : isDueToday ? 'due-today' : ''
                  }`}
                >
                  {(isOverdue || isDueToday) && <AlertCircle size={12} />}
                  <Calendar size={12} />
                  <span className="font-mono">{task.dueDate}</span>
                  {isOverdue && <span className="due-status-label">(Overdue)</span>}
                  {isDueToday && <span className="due-status-label">(Today)</span>}
                </span>
              )}
            </div>
          </div>

          <div className="task-item-actions">
            {/* TODO(feat): Implement drag handle icon and dnd-kit integration to allow manual task reordering. */}
            <button
              onClick={() => setIsEditing(true)}
              className="btn-action edit"
              title="Edit task"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="btn-action delete"
              title="Delete task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div className="task-edit-form animate-fade-in">
          <div className="edit-main-fields">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input-title"
              placeholder="Task title..."
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="edit-textarea"
              placeholder="Task description (optional)..."
              rows={2}
            />
          </div>

          <div className="edit-options-row">
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as Category)}
              className="edit-select"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="edit-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="edit-input-date"
            />
          </div>

          <div className="edit-buttons-row">
            <button onClick={handleSaveEdit} className="btn-save">
              <Save size={14} />
              <span>Save Changes</span>
            </button>
            <button onClick={handleCancelEdit} className="btn-cancel">
              <X size={14} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .task-item-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.95rem 1.05rem;
          margin-bottom: 0.65rem;
          box-shadow: var(--card-shadow);
          transition: all 0.2s ease;
        }

        .task-item-card:hover {
          border-color: var(--text-muted);
          box-shadow: var(--card-shadow-hover);
        }

        .task-item-card.completed {
          opacity: 0.75;
          background: var(--bg-primary);
        }

        .task-view-row {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
        }

        .custom-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid var(--text-muted);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          margin-top: 2px;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .custom-checkbox:hover {
          border-color: var(--accent-primary);
          background: var(--accent-light);
        }

        .custom-checkbox.checked {
          border-color: var(--accent-primary);
          background: var(--accent-primary);
        }

        .task-content {
          flex: 1;
          min-width: 0;
        }

        .task-title-row {
          margin-bottom: 0.25rem;
        }

        .task-title {
          font-size: 0.965rem;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-word;
          transition: all 0.15s ease;
        }

        .task-item-card.completed .task-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-description {
          font-size: 0.845rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          line-height: 1.45;
        }

        .task-meta-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-top: 0.45rem;
        }

        .badge-category {
          font-size: 0.725rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          border: 1px solid transparent;
        }

        .badge-priority {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.725rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .priority-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .badge-due-date {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.725rem;
          font-weight: 500;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }

        .badge-due-date.overdue {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          font-weight: 600;
        }

        .badge-due-date.due-today {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
          font-weight: 600;
        }

        .due-status-label {
          margin-left: 2px;
        }

        .task-item-actions {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          opacity: 0.85;
        }

        .task-item-card:hover .task-item-actions {
          opacity: 1;
        }

        .btn-action {
          width: 32px;
          height: 32px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-action.edit:hover {
          color: var(--accent-primary);
          background: var(--accent-light);
        }

        .btn-action.delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Editing Form */
        .task-edit-form {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .edit-input-title,
        .edit-textarea,
        .edit-select,
        .edit-input-date {
          width: 100%;
          padding: 0.45rem 0.65rem;
          border-radius: 7px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.865rem;
          font-family: inherit;
          outline: none;
        }

        .edit-input-title:focus,
        .edit-textarea:focus,
        .edit-select:focus,
        .edit-input-date:focus {
          border-color: var(--accent-primary);
        }

        .edit-options-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.5rem;
        }

        .edit-buttons-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .btn-save {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          border-radius: 7px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: white;
          background: var(--accent-primary);
          border: none;
          cursor: pointer;
        }

        .btn-cancel {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          border-radius: 7px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
