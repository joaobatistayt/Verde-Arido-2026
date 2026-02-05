import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  transparent?: boolean;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  rightAction,
  transparent = false,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`header ${transparent ? 'header-transparent' : ''}`}>
      <div className="header-content">
        {showBack && (
          <button className="header-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        {rightAction && <div className="header-action">{rightAction}</div>}
      </div>
    </header>
  );
}
