import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'action';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  onClick,
  className = '',
  icon,
  title,
  subtitle,
}: CardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`card card-${variant} card-padding-${padding} ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {(icon || title || subtitle) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          {(title || subtitle) && (
            <div className="card-header-text">
              {title && <h4 className="card-title">{title}</h4>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          )}
        </div>
      )}
      {children && <div className="card-content">{children}</div>}
    </Component>
  );
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

export function InfoCard({ icon, label, value, unit, highlight = false }: InfoCardProps) {
  return (
    <div className={`info-card ${highlight ? 'info-card-highlight' : ''}`}>
      <div className="info-card-icon">{icon}</div>
      <div className="info-card-content">
        <span className="info-card-label">{label}</span>
        <span className="info-card-value">
          {value}
          {unit && <span className="info-card-unit"> {unit}</span>}
        </span>
      </div>
    </div>
  );
}
