import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Character, Feature } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'
import { Field, TextareaField } from '@/components/shared/Field'
import { Modal } from '@/components/shared/Modal'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

function emptyFeature(): Feature {
  return { id: uuidv4(), name: '', source: '', levelGained: 0, description: '' }
}

const SOURCE_SUGGESTIONS = ['Race', 'Class', 'Background', 'Feat', 'Subclass', 'Other']

export function FeaturesSection({ character, onChange }: Props) {
  const [editFeature, setEditFeature] = useState<Feature | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function saveFeature(feat: Feature) {
    const exists = character.features.find(f => f.id === feat.id)
    onChange({
      ...character,
      features: exists
        ? character.features.map(f => f.id === feat.id ? feat : f)
        : [...character.features, feat],
    })
  }

  function removeFeature(id: string) {
    onChange({ ...character, features: character.features.filter(f => f.id !== id) })
  }

  function toggleExpand(id: string) {
    const next = new Set(expanded)
    next.has(id) ? next.delete(id) : next.add(id)
    setExpanded(next)
  }

  const grouped = SOURCE_SUGGESTIONS.reduce<Record<string, Feature[]>>((acc, src) => {
    acc[src] = character.features.filter(f => f.source === src)
    return acc
  }, { Other: [] })
  // uncategorized
  const uncat = character.features.filter(f => !SOURCE_SUGGESTIONS.includes(f.source) || f.source === 'Other')
  grouped['Other'] = [...grouped['Other'], ...uncat.filter(f => f.source !== 'Other')]

  return (
    <SectionPanel
      title="Features & Traits"
      actions={
        <button className="btn btn-ghost" style={{ padding: '0 0.5rem', fontSize: '0.75rem', minHeight: 28 }}
          onClick={() => setEditFeature(emptyFeature())}>
          + Add
        </button>
      }
    >
      {character.features.length === 0 && (
        <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>
          No features or traits yet.
        </p>
      )}

      {character.features.map(feat => (
        <div key={feat.id} className="expandable-card" style={{ marginBottom: '0.4rem' }}>
          <div className="expandable-card-header" onClick={() => toggleExpand(feat.id)}>
            <span className={`expandable-card-chevron ${expanded.has(feat.id) ? 'open' : ''}`}>▶</span>
            <span className="expandable-card-title">{feat.name || 'Unnamed Feature'}</span>
            {feat.source && (
              <span style={{ fontSize: '0.7rem', color: 'var(--ink-light)', fontStyle: 'italic' }}>{feat.source}{feat.levelGained > 0 ? ` (Lvl ${feat.levelGained})` : ''}</span>
            )}
            <button onClick={e => { e.stopPropagation(); setEditFeature({ ...feat }) }} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem', minHeight: 28 }}>Edit</button>
            <button onClick={e => { e.stopPropagation(); removeFeature(feat.id) }} style={{ background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem', minHeight: 28 }}>✕</button>
          </div>
          {expanded.has(feat.id) && feat.description && (
            <div className="expandable-card-body">
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{feat.description}</p>
            </div>
          )}
        </div>
      ))}

      {editFeature && (
        <Modal
          title={editFeature.name || 'Feature / Trait'}
          onClose={() => setEditFeature(null)}
          actions={
            <>
              <button className="btn" onClick={() => setEditFeature(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { saveFeature(editFeature); setEditFeature(null) }}>Save</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Field label="Name" value={editFeature.name} onChange={e => setEditFeature({ ...editFeature, name: e.target.value })} placeholder="e.g. Second Wind" autoFocus />
            <div className="grid-2">
              <div className="field-group">
                <label className="field-label">Source</label>
                <input
                  list="feature-source-list"
                  className="field-input"
                  value={editFeature.source}
                  onChange={e => setEditFeature({ ...editFeature, source: e.target.value })}
                  placeholder="e.g. Class"
                />
                <datalist id="feature-source-list">
                  {SOURCE_SUGGESTIONS.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
              <Field label="Level Gained" type="number" value={editFeature.levelGained} onChange={e => setEditFeature({ ...editFeature, levelGained: Number(e.target.value) })} min={0} max={20} />
            </div>
            <TextareaField label="Description" value={editFeature.description} onChange={e => setEditFeature({ ...editFeature, description: e.target.value })} rows={5} placeholder="Describe this feature or trait..." />
          </div>
        </Modal>
      )}
    </SectionPanel>
  )
}
