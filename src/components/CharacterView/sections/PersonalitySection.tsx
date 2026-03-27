import type { Character } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'
import { TextareaField } from '@/components/shared/Field'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

export function PersonalitySection({ character, onChange }: Props) {
  function set<K extends keyof Character>(key: K, value: Character[K]) {
    onChange({ ...character, [key]: value })
  }

  return (
    <SectionPanel title="Personality">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextareaField
          label="Personality Traits"
          value={character.personalityTraits}
          onChange={e => set('personalityTraits', e.target.value)}
          placeholder="How does your character act? What are their quirks?"
          rows={3}
        />
        <TextareaField
          label="Ideals"
          value={character.ideals}
          onChange={e => set('ideals', e.target.value)}
          placeholder="What drives your character? What do they believe in?"
          rows={2}
        />
        <TextareaField
          label="Bonds"
          value={character.bonds}
          onChange={e => set('bonds', e.target.value)}
          placeholder="Who or what is your character connected to?"
          rows={2}
        />
        <TextareaField
          label="Flaws"
          value={character.flaws}
          onChange={e => set('flaws', e.target.value)}
          placeholder="What are your character's weaknesses or vices?"
          rows={2}
        />
      </div>
    </SectionPanel>
  )
}
