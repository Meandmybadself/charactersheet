import { v4 as uuidv4 } from 'uuid'
import type { Character, ClassEntry } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'
import { Field, SelectField } from '@/components/shared/Field'
import { ALIGNMENTS, CLASS_SUGGESTIONS, HIT_DICE_OPTIONS } from '@/types/character'
import { totalLevel } from '@/utils/calc'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

export function HeaderSection({ character, onChange }: Props) {
  function set<K extends keyof Character>(key: K, value: Character[K]) {
    onChange({ ...character, [key]: value })
  }

  function updateClass(id: string, updates: Partial<ClassEntry>) {
    onChange({
      ...character,
      classes: character.classes.map(c => c.id === id ? { ...c, ...updates } : c),
    })
  }

  function addClass() {
    const newClass: ClassEntry = {
      id: uuidv4(),
      className: '',
      subclass: '',
      level: 1,
      hitDie: 8,
      isSpellcaster: false,
      spellcastingAbility: '',
    }
    onChange({ ...character, classes: [...character.classes, newClass] })
  }

  function removeClass(id: string) {
    onChange({ ...character, classes: character.classes.filter(c => c.id !== id) })
  }

  const lvl = totalLevel(character)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Core identity */}
      <SectionPanel title="Identity">
        <div className="grid-2" style={{ marginBottom: '1rem' }}>
          <Field
            label="Character Name"
            value={character.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Name your adventurer..."
            style={{ fontSize: '1.05rem', fontWeight: 600 }}
          />
          <Field
            label="Player Name"
            value={character.playerName}
            onChange={e => set('playerName', e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="grid-3" style={{ marginBottom: '1rem' }}>
          <Field
            label="Race"
            value={character.race}
            onChange={e => set('race', e.target.value)}
            placeholder="e.g. Human"
          />
          <Field
            label="Subrace"
            value={character.subrace}
            onChange={e => set('subrace', e.target.value)}
            placeholder="e.g. High Elf"
          />
          <SelectField
            label="Alignment"
            value={character.alignment}
            onChange={e => set('alignment', e.target.value as Character['alignment'])}
            options={ALIGNMENTS}
            placeholder="— Choose —"
          />
        </div>
        <div className="grid-3">
          <Field
            label="Background"
            value={character.background}
            onChange={e => set('background', e.target.value)}
            placeholder="e.g. Soldier"
          />
          <Field
            label="Campaign"
            value={character.campaignName}
            onChange={e => set('campaignName', e.target.value)}
            placeholder="Campaign name"
          />
          <Field
            label="Experience Points"
            type="number"
            value={character.xp}
            onChange={e => set('xp', Number(e.target.value))}
            min={0}
          />
        </div>
      </SectionPanel>

      {/* Classes */}
      <SectionPanel
        title={`Classes${lvl > 0 ? ` — Level ${lvl}` : ''}`}
        actions={
          <button className="btn btn-ghost" style={{ padding: '0 0.5rem', fontSize: '0.75rem', minHeight: 28 }} onClick={addClass}>
            + Add Class
          </button>
        }
      >
        {character.classes.length === 0 && (
          <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>
            No classes yet. Add one to get started.
          </p>
        )}
        {character.classes.map((cls, i) => (
          <div key={cls.id} style={{ marginBottom: i < character.classes.length - 1 ? '1rem' : 0 }}>
            <div className="grid-3" style={{ marginBottom: '0.5rem' }}>
              <div className="field-group">
                <label className="field-label">Class</label>
                <input
                  list={`class-list-${cls.id}`}
                  className="field-input"
                  value={cls.className}
                  onChange={e => updateClass(cls.id, { className: e.target.value })}
                  placeholder="e.g. Fighter"
                />
                <datalist id={`class-list-${cls.id}`}>
                  {CLASS_SUGGESTIONS.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <Field
                label="Subclass"
                value={cls.subclass}
                onChange={e => updateClass(cls.id, { subclass: e.target.value })}
                placeholder="e.g. Champion"
              />
              <Field
                label="Level"
                type="number"
                value={cls.level}
                onChange={e => updateClass(cls.id, { level: Math.max(1, Math.min(20, Number(e.target.value))) })}
                min={1}
                max={20}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <SelectField
                label="Hit Die"
                value={cls.hitDie}
                onChange={e => updateClass(cls.id, { hitDie: Number(e.target.value) as ClassEntry['hitDie'] })}
                options={HIT_DICE_OPTIONS.map(d => ({ value: String(d), label: `d${d}` }))}
              />
              <div className="field-group">
                <label className="field-label">Spellcaster?</label>
                <label className="field-checkbox-row">
                  <input
                    type="checkbox"
                    className="field-checkbox"
                    checked={cls.isSpellcaster}
                    onChange={e => updateClass(cls.id, { isSpellcaster: e.target.checked, spellcastingAbility: e.target.checked ? cls.spellcastingAbility : '' })}
                  />
                  <span style={{ fontSize: '0.85rem' }}>Yes</span>
                </label>
              </div>
              {cls.isSpellcaster && (
                <SelectField
                  label="Casting Ability"
                  value={cls.spellcastingAbility}
                  onChange={e => updateClass(cls.id, { spellcastingAbility: e.target.value as ClassEntry['spellcastingAbility'] })}
                  options={[
                    { value: 'int', label: 'Intelligence' },
                    { value: 'wis', label: 'Wisdom' },
                    { value: 'cha', label: 'Charisma' },
                  ]}
                  placeholder="— Choose —"
                />
              )}
              <button
                className="btn btn-ghost"
                style={{ color: 'var(--crimson)', fontSize: '0.75rem', minHeight: 36 }}
                onClick={() => removeClass(cls.id)}
              >
                Remove
              </button>
            </div>
            {i < character.classes.length - 1 && <div className="divider" style={{ marginTop: '1rem' }} />}
          </div>
        ))}
      </SectionPanel>

      {/* Appearance */}
      <SectionPanel title="Appearance">
        <div className="grid-3" style={{ marginBottom: '1rem' }}>
          <Field label="Age" value={character.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 28" />
          <Field label="Height" value={character.height} onChange={e => set('height', e.target.value)} placeholder="e.g. 5'10&quot;" />
          <Field label="Weight" value={character.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 160 lbs" />
        </div>
        <div className="grid-3">
          <Field label="Eyes" value={character.eyes} onChange={e => set('eyes', e.target.value)} placeholder="e.g. Brown" />
          <Field label="Skin" value={character.skin} onChange={e => set('skin', e.target.value)} placeholder="e.g. Pale" />
          <Field label="Hair" value={character.hair} onChange={e => set('hair', e.target.value)} placeholder="e.g. Black" />
        </div>
      </SectionPanel>

      {/* Settings */}
      <SectionPanel title="Settings">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={character.autoCalc}
              onChange={e => set('autoCalc', e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', marginBottom: '0.15rem' }}>
              Auto-Calculate Stats {character.autoCalc ? <span className="autocalc-badge">On</span> : <span className="autocalc-badge" style={{ opacity: 0.5 }}>Off</span>}
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              {character.autoCalc
                ? 'Modifiers, proficiency bonus, passive perception, and spell DCs are computed automatically.'
                : 'All values are entered manually.'}
            </div>
          </div>
        </label>
      </SectionPanel>
    </div>
  )
}

