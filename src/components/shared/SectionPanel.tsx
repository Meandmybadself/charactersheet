import type { ReactNode } from 'react'

interface SectionPanelProps {
  title: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

export function SectionPanel({ title, children, className = '', actions }: SectionPanelProps) {
  return (
    <div className={`section-panel ${className}`}>
      <div className="section-panel-title">
        <span style={{ flex: 1 }}>{title}</span>
        {actions}
      </div>
      {children}
    </div>
  )
}
