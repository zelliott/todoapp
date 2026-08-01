import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import type { Category, FilterStatus, SortOption } from '../types/todo';
import { CATEGORIES } from '../utils/constants';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  categoryFilter: Category | 'all';
  onCategoryFilterChange: (category: Category | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  counts,
}) => {
  return (
    <div className="filters-container">
      <div className="filters-top-row">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Saerch tasks..."
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sort-box">
          <ArrowUpDown size={14} className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="alphabetical">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      <div className="filters-second-row">
        <div className="status-tabs">
          {(
            [
              { id: 'all', label: 'All', count: counts.all },
              { id: 'active', label: 'Active', count: counts.active },
              { id: 'completed', label: 'Completed', count: counts.completed },
            ] as { id: FilterStatus; label: string; count: number }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`status-tab ${statusFilter === tab.id ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              <span className="tab-count font-mono">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="category-scroll">
          <button
            onClick={() => onCategoryFilterChange('all')}
            className={`category-pill ${categoryFilter === 'all' ? 'active' : ''}`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryFilterChange(cat)}
              className={`category-pill ${categoryFilter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .filters-container {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.1rem;
        }

        .filters-top-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 2.25rem 0.5rem 2.25rem;
          border-radius: 9px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .search-input:focus {
          border-color: var(--accent-primary);
        }

        .search-clear-btn {
          position: absolute;
          right: 0.6rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }

        .search-clear-btn:hover {
          color: var(--text-primary);
        }

        .sort-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 9px;
          padding: 0 0.65rem;
        }

        .sort-icon {
          color: var(--text-muted);
        }

        .sort-select {
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 0.5rem 0.25rem;
          outline: none;
          cursor: pointer;
        }

        .filters-second-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .status-tabs {
          display: inline-flex;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 9px;
          padding: 3px;
        }

        .status-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          border-radius: 7px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .status-tab.active {
          color: var(--accent-primary);
          background: var(--accent-light);
          font-weight: 600;
        }

        .tab-count {
          font-size: 0.725rem;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }

        .status-tab.active .tab-count {
          background: var(--accent-primary);
          color: white;
        }

        .category-scroll {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .category-pill {
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          font-size: 0.775rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .category-pill:hover,
        .category-pill.active {
          color: var(--accent-primary);
          background: var(--accent-light);
          border-color: var(--accent-primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
