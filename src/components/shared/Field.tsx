import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Field({ label, className = '', ...props }: FieldProps) {
  return (
    <div className={`field-group ${className}`}>
      <label className="field-label">{label}</label>
      <input className="field-input" {...props} />
    </div>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Array<{ value: string; label: string } | string>
  placeholder?: string
}

export function SelectField({ label, options, placeholder, className = '', ...props }: SelectFieldProps) {
  return (
    <div className={`field-group ${className}`}>
      <label className="field-label">{label}</label>
      <select className="field-input field-select" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => {
          const value = typeof opt === 'string' ? opt : opt.value
          const lbl = typeof opt === 'string' ? opt : opt.label
          return <option key={value} value={value}>{lbl}</option>
        })}
      </select>
    </div>
  )
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextareaField({ label, className = '', ...props }: TextareaFieldProps) {
  return (
    <div className={`field-group ${className}`}>
      <label className="field-label">{label}</label>
      <textarea className="field-textarea" {...props} />
    </div>
  )
}
