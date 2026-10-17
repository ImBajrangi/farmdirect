import React from 'react';
import { Button } from './Button';
import './common.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🌾',
  title,
  description,
  action,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="heading-3" style={{ marginBottom: 'var(--space-1)' }}>
        {title}
      </h3>
      {description && (
        <p className="text-subtle" style={{ marginBottom: 'var(--space-4)' }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
      {!action && actionLabel && onAction && (
        <div>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
