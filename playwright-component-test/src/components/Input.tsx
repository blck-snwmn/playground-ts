import { ChangeEvent, FocusEvent, KeyboardEvent, useState } from 'react';

interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  autoFocus?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
}

export function Input({
  value: controlledValue,
  defaultValue = '',
  placeholder,
  label,
  name,
  type = 'text',
  required = false,
  disabled = false,
  readOnly = false,
  maxLength,
  minLength,
  pattern,
  error,
  helperText,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  autoComplete,
  autoFocus = false,
  variant = 'outlined',
  size = 'medium',
}: InputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const inputValue = isControlled ? controlledValue : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  };

  const inputClassName = `input input-${variant} input-${size} ${error ? 'input-error' : ''}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={inputValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={inputClassName}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        data-testid="input-element"
      />
      {error && (
        <span id={`${name}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${name}-helper`} className="input-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
}