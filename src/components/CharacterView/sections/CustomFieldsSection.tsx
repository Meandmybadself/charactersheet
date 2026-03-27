import { v4 as uuidv4 } from 'uuid'
import type { Character, CustomField } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

function emptyField(): CustomField {
  return { id: uuidv4(), name: '', value: '', fieldType: 'text' }
}

export function CustomFieldsSection({ character, onChange }: Props) {
  function updateField(id: string, updates: Partial<CustomField>) {
    onChange({ ...character, customFields: character.customFields.map(f => f.id === id ? { ...f, ...updates } : f) })
  }

  function removeField(id: string) {
    onChange({ ...character, customFields: character.customFields.filter(f => f.id !== id) })
  }

  return (
    <SectionPanel
      title="Custom Fields"
      actions={
        <button className="btn btn-ghost" style={{ padding: '0 0.5rem', fontSize: '0.75rem', minHeight: 28 }}
          onClick={() => onChange({ ...character, customFields: [...character.customFields, emptyField()] })}>
          + Add Field
        </button>
      }
    >
      <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
        Add your own fields for homebrew mechanics, tracker values, or anything else.
      </p>

      {character.customFields.length === 0 && (
        <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>No custom fields yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {character.customFields.map(field => (
          <div key={field.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <input
                className="field-input"
                value={field.name}
                onChange={e => updateField(field.id, { name: e.target.value })}
                placeholder="Field name..."
                style={{ marginBottom: '0.35rem', fontFamily: 'var(--font-heading)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}
              />
              {field.fieldType === 'textarea'
                ? <textarea
                    className="field-textarea"
                    value={field.value}
                    onChange={e => updateField(field.id, { value: e.target.value })}
                    placeholder="Value..."
                    rows={3}
                    style={{ marginTop: '0.15rem' }}
                  />
                : <input
                    type={field.fieldType === 'number' ? 'number' : 'text'}
                    className="field-input"
                    value={field.value}
                    onChange={e => updateField(field.id, { value: e.target.value })}
                    placeholder="Value..."
                  />
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center', paddingTop: '0.5rem' }}>
              <select
                value={field.fieldType}
                onChange={e => updateField(field.id, { fieldType: e.target.value as CustomField['fieldType'] })}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: 4, outline: 'none', color: 'var(--ink-light)', padding: '0.2rem 0.4rem', cursor: 'pointer' }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="textarea">Multiline</option>
              </select>
              <button
                onClick={() => removeField(field.id)}
                style={{ background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.2rem', minHeight: 32 }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionPanel>
  )
}
