import React from 'react';
import {
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  Flame,
  RotateCcw,
  CheckCheck,
} from 'lucide-react';
import type { ThemeMode } from '../types/todo';

interface HeaderProps {
  totalTasks: number;
  completedTasks: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onResetDemo: () => void;
  onClearCompleted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalTasks,
  completedTasks,
  theme,
  onToggleTheme,
  onResetDemo,
  onClearCompleted,
}) => {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getMotivationalMessage = () => {
    if (totalTasks === 0) return 'Add your first task below to get started!';
    if (percentage === 100) return 'Awesome job! All tasks completed today 🎉';
    if (percentage >= 75) return "Almost there! You're crushing your to-do list 🚀";
    if (percentage >= 40) return "Great momentum! Keep pushing forward 💪";
    return "Let's tackle your priorites one by one ✨";
  };

  return (
    <header className="header-container">
      <div className="header-top">
        <div className="brand">
          <div className="brand-icon">
            <CheckCircle2 size={26} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <p className="brand-subtitle">Streamlined productivity & task management</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={onResetDemo}
            className="btn-icon-text"
            title="Load starter demo tasks"
          >
            <RotateCcw size={15} />
            <span>Demo Data</span>
          </button>

          {completedTasks > 0 && (
            <button
              onClick={onClearCompleted}
              className="btn-icon-text text-danger"
              title="Clear completed tasks"
            >
              <CheckCheck size={15} />
              <span>Clear Done ({completedTasks})</span>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="btn-icon-only"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <div className="progress-card">
        <div className="progress-header">
          <div className="progress-title-group">
            {percentage === 100 ? (
              <Sparkles size={18} className="text-amber" />
            ) : percentage >= 50 ? (
              <Flame size={18} className="text-indigo" />
            ) : (
              <CheckCircle2 size={18} className="text-indigo" />
            )}
            <span className="progress-message">{getMotivationalMessage()}</span>
          </div>

          <div className="progress-stats">
            <span className="font-mono stats-numbers">
              {completedTasks} / {totalTasks}
            </span>
            <span className="stats-label">Completed</span>
          </div>
        </div>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <style>{`
        .header-container {
          margin-bottom: 1.5rem;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--header-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .brand-title {
          font-size: 1.65rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          line-height: 1.15;
        }

        .brand-subtitle {
          font-size: 0.825rem;
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-icon-text {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-icon-text:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--text-muted);
        }

        .btn-icon-text.text-danger:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.08);
        }

        .btn-icon-only {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-icon-only:hover {
          color: var(--accent-primary);
          background: var(--bg-hover);
          border-color: var(--accent-primary);
        }

        .progress-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 1.1rem 1.25rem;
          box-shadow: var(--card-shadow);
        }

        .progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .progress-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .progress-message {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .progress-stats {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .stats-numbers {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--accent-primary);
        }

        .stats-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .progress-bar-track {
          width: 100%;
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--header-gradient);
          border-radius: 999px;
          transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .text-amber {
          color: #f59e0b;
        }

        .text-indigo {
          color: var(--accent-primary);
        }
      `}</style>
    </header>
  );
};
