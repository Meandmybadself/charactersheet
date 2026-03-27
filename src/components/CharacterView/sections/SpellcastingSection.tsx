import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Character, Spell, SpellLevel, SpellSlotLevel } from '@/types/character'
import { SPELL_SCHOOLS } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'
import { Field, SelectField, TextareaField } from '@/components/shared/Field'
import { spellSaveDC, spellAttackBonus, formatMod } from '@/utils/calc'
import { Modal } from '@/components/shared/Modal'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

const SPELL_LEVELS: SpellSlotLevel[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const SLOT_LEVELS: SpellLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function emptySpell(): Spell {
  return {
    id: uuidv4(), name: '', level: 0, school: '', castingTime: '1 action',
    range: '', components: '', duration: '', concentration: false, ritual: false,
    prepared: false, description: '', source: '',
  }
}

export function SpellcastingSection({ character, onChange }: Props) {
  const [editSpell, setEditSpell] = useState<Spell | null>(null)
  const [expandedLevel, setExpandedLevel] = useState<Set<SpellSlotLevel>>(new Set([0, 1]))

  const saveDC = spellSaveDC(character)
  const atkBonus = spellAttackBonus(character)

  function updateSpell(spell: Spell) {
    const exists = character.spells.find(s => s.id === spell.id)
    onChange({
      ...character,
      spells: exists ? character.spells.map(s => s.id === spell.id ? spell : s) : [...character.spells, spell],
    })
  }

  function removeSpell(id: string) {
    onChange({ ...character, spells: character.spells.filter(s => s.id !== id) })
  }

  function toggleSlot(level: SpellLevel, index: number) {
    const slot = character.spellSlots[level]
    const used = slot.used === index + 1 ? index : index + 1
    onChange({
      ...character,
      spellSlots: { ...character.spellSlots, [level]: { ...slot, used } },
    })
  }

  function updateSlotMax(level: SpellLevel, max: number) {
    const slot = character.spellSlots[level]
    onChange({
      ...character,
      spellSlots: { ...character.spellSlots, [level]: { max, used: Math.min(slot.used, max) } },
    })
  }

  function toggleLevel(level: SpellSlotLevel) {
    const next = new Set(expandedLevel)
    next.has(level) ? next.delete(level) : next.add(level)
    setExpandedLevel(next)
  }

  const isSpellcaster = character.classes.some(c => c.isSpellcaster)

  if (!isSpellcaster && character.spells.length === 0) {
    return (
      <SectionPanel title="Spellcasting">
        <p className="text-muted" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          No spellcasting classes found. Mark a class as a spellcaster in the Identity section to enable spellcasting.
        </p>
      </SectionPanel>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Spell stats */}
      <SectionPanel title="Spellcasting Stats">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Spell Save DC</div>
            <div className="stat-bubble-value">
              {character.autoCalc
                ? saveDC
                : <input type="number" value={character.spellSaveDC}
                    onChange={e => onChange({ ...character, spellSaveDC: Number(e.target.value) })}
                    style={{ width: 52, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', outline: 'none', color: 'var(--ink)' }}
                  />
              }
            </div>
          </div>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Spell Atk Bonus</div>
            <div className="stat-bubble-value">
              {character.autoCalc
                ? formatMod(atkBonus)
                : <input type="number" value={character.spellAttackBonus}
                    onChange={e => onChange({ ...character, spellAttackBonus: Number(e.target.value) })}
                    style={{ width: 52, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', outline: 'none', color: 'var(--ink)' }}
                  />
              }
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* Spell slots */}
      <SectionPanel title="Spell Slots">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {SLOT_LEVELS.map(level => {
            const slot = character.spellSlots[level]
            return (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--gold)', width: 48, flexShrink: 0 }}>
                  Level {level}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <input
                    type="number"
                    value={slot.max}
                    onChange={e => updateSlotMax(level, Math.max(0, Number(e.target.value)))}
                    min={0}
                    max={9}
                    style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: 4, outline: 'none', color: 'var(--ink)', padding: '0.15rem' }}
                  />
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>max</span>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {Array.from({ length: slot.max }).map((_, i) => (
                    <span
                      key={i}
                      className={`slot-pip ${i < slot.used ? 'used' : ''}`}
                      onClick={() => toggleSlot(level, i)}
                      title={i < slot.used ? 'Used — click to restore' : 'Available — click to use'}
                    />
                  ))}
                </div>
                {slot.max > 0 && (
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {slot.max - slot.used}/{slot.max} remaining
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </SectionPanel>

      {/* Spell list */}
      <SectionPanel
        title="Spells Known"
        actions={
          <button className="btn btn-ghost" style={{ padding: '0 0.5rem', fontSize: '0.75rem', minHeight: 28 }}
            onClick={() => setEditSpell(emptySpell())}>
            + Add Spell
          </button>
        }
      >
        {SPELL_LEVELS.map(level => {
          const levelSpells = character.spells.filter(s => s.level === level)
          if (levelSpells.length === 0) return null
          const expanded = expandedLevel.has(level)
          return (
            <div key={level} style={{ marginBottom: '0.5rem' }}>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', padding: '0.25rem 0', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.08em' }}
                onClick={() => toggleLevel(level)}
              >
                <span style={{ fontSize: '0.6rem', transform: expanded ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▶</span>
                {level === 0 ? 'Cantrips' : `Level ${level}`}
                <span style={{ color: 'var(--ink-light)', fontWeight: 400 }}>({levelSpells.length})</span>
              </button>
              {expanded && levelSpells.map(spell => (
                <div key={spell.id} className="expandable-card" style={{ marginTop: '0.25rem' }}>
                  <div className="expandable-card-header">
                    <span className="spell-level-badge">{level === 0 ? 'C' : level}</span>
                    <span className="expandable-card-title">{spell.name || 'Unnamed Spell'}</span>
                    {spell.ritual && <span style={{ fontSize: '0.65rem', color: 'var(--gold)', border: '1px solid var(--border-light)', borderRadius: 3, padding: '0 3px' }}>R</span>}
                    {spell.concentration && <span style={{ fontSize: '0.65rem', color: 'var(--crimson)', border: '1px solid var(--border-light)', borderRadius: 3, padding: '0 3px' }}>C</span>}
                    <span
                      className={`prof-dot ${spell.prepared ? 'full' : ''}`}
                      title={spell.prepared ? 'Prepared' : 'Not prepared'}
                      onClick={e => { e.stopPropagation(); updateSpell({ ...spell, prepared: !spell.prepared }) }}
                    />
                    <button onClick={e => { e.stopPropagation(); setEditSpell({ ...spell }) }} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem', minHeight: 28 }}>Edit</button>
                    <button onClick={e => { e.stopPropagation(); removeSpell(spell.id) }} style={{ background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem', minHeight: 28 }}>✕</button>
                  </div>
                  {spell.description && (
                    <div className="expandable-card-body" style={{ display: 'none' }}>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{spell.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
        {character.spells.length === 0 && (
          <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>No spells yet.</p>
        )}
      </SectionPanel>

      {/* Edit spell modal */}
      {editSpell && (
        <Modal
          title={editSpell.name || 'New Spell'}
          onClose={() => setEditSpell(null)}
          actions={
            <>
              <button className="btn" onClick={() => setEditSpell(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { updateSpell(editSpell); setEditSpell(null) }}>Save</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="grid-2">
              <Field label="Spell Name" value={editSpell.name} onChange={e => setEditSpell({ ...editSpell, name: e.target.value })} placeholder="e.g. Fireball" autoFocus />
              <div className="field-group">
                <label className="field-label">Spell Level</label>
                <select className="field-input field-select" value={editSpell.level} onChange={e => setEditSpell({ ...editSpell, level: Number(e.target.value) as SpellSlotLevel })}>
                  <option value={0}>Cantrip</option>
                  {[1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Level {l}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <SelectField label="School" value={editSpell.school} onChange={e => setEditSpell({ ...editSpell, school: e.target.value })} options={SPELL_SCHOOLS} placeholder="— Choose —" />
              <Field label="Casting Time" value={editSpell.castingTime} onChange={e => setEditSpell({ ...editSpell, castingTime: e.target.value })} placeholder="1 action" />
            </div>
            <div className="grid-2">
              <Field label="Range" value={editSpell.range} onChange={e => setEditSpell({ ...editSpell, range: e.target.value })} placeholder="150 feet" />
              <Field label="Duration" value={editSpell.duration} onChange={e => setEditSpell({ ...editSpell, duration: e.target.value })} placeholder="Instantaneous" />
            </div>
            <Field label="Components" value={editSpell.components} onChange={e => setEditSpell({ ...editSpell, components: e.target.value })} placeholder="V, S, M (a tiny ball of bat guano)" />
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <label className="field-checkbox-row">
                <input type="checkbox" className="field-checkbox" checked={editSpell.concentration} onChange={e => setEditSpell({ ...editSpell, concentration: e.target.checked })} />
                <span style={{ fontSize: '0.85rem' }}>Concentration</span>
              </label>
              <label className="field-checkbox-row">
                <input type="checkbox" className="field-checkbox" checked={editSpell.ritual} onChange={e => setEditSpell({ ...editSpell, ritual: e.target.checked })} />
                <span style={{ fontSize: '0.85rem' }}>Ritual</span>
              </label>
              <label className="field-checkbox-row">
                <input type="checkbox" className="field-checkbox" checked={editSpell.prepared} onChange={e => setEditSpell({ ...editSpell, prepared: e.target.checked })} />
                <span style={{ fontSize: '0.85rem' }}>Prepared</span>
              </label>
            </div>
            <TextareaField label="Description" value={editSpell.description} onChange={e => setEditSpell({ ...editSpell, description: e.target.value })} rows={4} placeholder="Spell description..." />
            <Field label="Source" value={editSpell.source} onChange={e => setEditSpell({ ...editSpell, source: e.target.value })} placeholder="PHB p.241" />
          </div>
        </Modal>
      )}
    </div>
  )
}
