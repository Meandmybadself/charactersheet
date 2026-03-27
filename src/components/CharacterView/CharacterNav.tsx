export type SectionId =
  | 'header' | 'abilities' | 'combat' | 'saves-skills'
  | 'attacks' | 'spellcasting' | 'equipment' | 'features'
  | 'personality' | 'backstory' | 'custom'

export interface NavSection {
  id: SectionId
  label: string
  icon: string
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'header',       label: 'Identity',      icon: '🧑' },
  { id: 'abilities',    label: 'Abilities',      icon: '💪' },
  { id: 'combat',       label: 'Combat',         icon: '⚔️' },
  { id: 'saves-skills', label: 'Skills & Saves', icon: '🎯' },
  { id: 'attacks',      label: 'Attacks',        icon: '🗡️' },
  { id: 'spellcasting', label: 'Spellcasting',   icon: '✨' },
  { id: 'equipment',    label: 'Equipment',      icon: '🎒' },
  { id: 'features',     label: 'Features',       icon: '📜' },
  { id: 'personality',  label: 'Personality',    icon: '🎭' },
  { id: 'backstory',    label: 'Backstory',      icon: '📖' },
  { id: 'custom',       label: 'Custom Fields',  icon: '⚙️' },
]

interface Props {
  active: SectionId
  onChange: (id: SectionId) => void
  variant: 'sidebar' | 'tabs'
}

export function CharacterNav({ active, onChange, variant }: Props) {
  if (variant === 'tabs') {
    return (
      <div className="mobile-nav-tabs">
        {NAV_SECTIONS.map(s => (
          <button
            key={s.id}
            className={`mobile-tab ${active === s.id ? 'active' : ''}`}
            onClick={() => onChange(s.id)}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <nav>
      {NAV_SECTIONS.map(s => (
        <button
          key={s.id}
          className={`nav-item ${active === s.id ? 'active' : ''}`}
          onClick={() => onChange(s.id)}
        >
          <span className="nav-item-icon">{s.icon}</span>
          {s.label}
        </button>
      ))}
    </nav>
  )
}
