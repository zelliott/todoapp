import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Tag,
  Flag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Category, Priority } from '../types/todo';
import { CATEGORIES, PRIORITY_CONFIG } from '../utils/constants';

interface TaskFormProps {
  onAddTask: (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    category: Category;
    dueDate?: string;
  }) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Work');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask({
      title: trimmedTitle,
      description: description.trim() || undefined,
      priority,
      category,
      dueDate: dueDate || undefined,
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-main-row">
          <div className="title-input-wrapper">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className="task-title-input"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`btn-toggle-options ${isExpanded ? 'active' : ''}`}
            title="More options (Category, Priority, Due Date)"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>Details</span>
          </button>

          <button
            type="submit"
            disabled={!title.trim()}
            className="btn-add-task"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {isExpanded && (
          <div className="form-expanded-section animate-slide-down">
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <Tag size={13} />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="form-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <Flag size={13} />
                  <span>Priority</span>
                </label>
                {/* TODO(a11y): Add role="radiogroup" to priority container and aria-checked={priority === p} to priority pill buttons. */}
                <div className="priority-pill-group">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                    const cfg = PRIORITY_CONFIG[p];
                    const selected = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`priority-pill ${selected ? 'selected' : ''}`}
                        style={{
                          '--priority-color': cfg.color,
                        } as React.CSSProperties}
                      >
                        <span
                          className="priority-dot"
                          style={{ backgroundColor: cfg.color }}
                        />
                        <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  <Calendar size={13} />
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-input-date"
                />
              </div>
            </div>

            <div className="form-field-textarea">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes or description..."
                rows={2}
                className="form-textarea"
              />
            </div>
          </div>
        )}
      </form>

      <style>{`
        .task-form-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 0.85rem 1rem;
          margin-bottom: 1.25rem;
          box-shadow: var(--card-shadow);
        }

        .form-main-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .title-input-wrapper {
          flex: 1;
        }

        .task-title-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.975rem;
          color: var(--text-primary);
          padding: 0.5rem 0.25rem;
          outline: none;
        }

        .task-title-input::placeholder {
          color: var(--text-muted);
        }

        .btn-toggle-options {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-toggle-options:hover,
        .btn-toggle-options.active {
          color: var(--accent-primary);
          background: var(--accent-light);
        }

        .btn-add-task {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1.1rem;
          border-radius: 9px;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          background: var(--accent-primary);
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        }

        .btn-add-task:hover:not(:disabled) {
          background: var(--accent-primary-hover);
          transform: translateY(-1px);
        }

        .btn-add-task:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .form-expanded-section {
          margin-top: 0.85rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-color);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
        }

        .form-select,
        .form-input-date,
        .form-textarea {
          width: 100%;
          padding: 0.45rem 0.65rem;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.845rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .form-select:focus,
        .form-input-date:focus,
        .form-textarea:focus {
          border-color: var(--accent-primary);
        }

        .priority-pill-group {
          display: flex;
          gap: 0.35rem;
        }

        .priority-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.45rem 0.5rem;
          border-radius: 8px;
          font-size: 0.775rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .priority-pill.selected {
          color: var(--priority-color);
          border-color: var(--priority-color);
          background: var(--bg-tertiary);
          font-weight: 600;
        }

        .priority-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .form-field-textarea {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};
