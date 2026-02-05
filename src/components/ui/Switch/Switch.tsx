import './Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled = false }: SwitchProps) {
  return (
    <label className={`switch-wrapper ${disabled ? 'disabled' : ''}`}>
      <div className="switch-text">
        {label && <span className="switch-label">{label}</span>}
        {description && <span className="switch-description">{description}</span>}
      </div>
      <div className="switch-container">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="switch-input"
        />
        <span className="switch-slider" />
      </div>
    </label>
  );
}
