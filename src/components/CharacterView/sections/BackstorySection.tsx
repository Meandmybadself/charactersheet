import type { Character } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'
import { TextareaField } from '@/components/shared/Field'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

export function BackstorySection({ character, onChange }: Props) {
  function set<K extends keyof Character>(key: K, value: Character[K]) {
    onChange({ ...character, [key]: value })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SectionPanel title="Character History">
        <TextareaField
          label="Backstory"
          value={character.backstory}
          onChange={e => set('backstory', e.target.value)}
          placeholder="Your character's history and origin..."
          rows={8}
        />
      </SectionPanel>
      <SectionPanel title="Allies & Organizations">
        <TextareaField
          label="Allies, Organizations & Factions"
          value={character.alliesOrganizations}
          onChange={e => set('alliesOrganizations', e.target.value)}
          placeholder="Groups and individuals your character knows or belongs to..."
          rows={4}
        />
      </SectionPanel>
      <SectionPanel title="Notes">
        <TextareaField
          label="Additional Notes"
          value={character.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Anything else worth remembering..."
          rows={4}
        />
      </SectionPanel>
    </div>
  )
}
