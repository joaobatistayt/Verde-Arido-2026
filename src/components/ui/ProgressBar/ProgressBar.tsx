import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="progress-wrapper">
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && <span className="progress-percentage">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`progress-bar progress-${size}`}>
        <div
          className={`progress-fill progress-${variant}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface NutrientProgressProps {
  protein: number;
  energy: number;
}

export function NutrientProgress({ protein, energy }: NutrientProgressProps) {
  return (
    <div className="nutrient-progress">
      <ProgressBar
        value={protein}
        label="Proteína Bruta (PB)"
        variant={protein >= 100 ? 'success' : protein >= 80 ? 'warning' : 'danger'}
      />
      <ProgressBar
        value={energy}
        label="Energia (NDT)"
        variant={energy >= 100 ? 'success' : energy >= 80 ? 'warning' : 'danger'}
      />
    </div>
  );
}
