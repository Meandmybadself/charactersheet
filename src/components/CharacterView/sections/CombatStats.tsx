import type { Character } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'
import { formatMod, initiativeBonus, hitDiceString } from '@/utils/calc'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

function NumInput({
  value, onChange, min, max, style
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  style?: React.CSSProperties
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      min={min}
      max={max}
      style={{
        fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700,
        background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)',
        outline: 'none', textAlign: 'center', color: 'var(--ink)', width: 52,
        ...style
      }}
    />
  )
}

export function CombatStats({ character, onChange }: Props) {
  function setHp(key: keyof typeof character.hp, value: number) {
    onChange({ ...character, hp: { ...character.hp, [key]: value } })
  }

  function setDeathSave(key: 'successes' | 'failures', value: number) {
    onChange({ ...character, deathSaves: { ...character.deathSaves, [key]: value } })
  }

  const init = initiativeBonus(character)
  const hpPct = character.hp.max > 0
    ? Math.max(0, Math.min(100, (character.hp.current / character.hp.max) * 100))
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Core stats row */}
      <SectionPanel title="Combat Statistics">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Armor Class</div>
            <div className="stat-bubble-value">
              <NumInput value={character.ac} onChange={v => onChange({ ...character, ac: v })} min={0} />
            </div>
          </div>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Initiative</div>
            <div className="stat-bubble-value">
              {character.autoCalc
                ? formatMod(init)
                : <NumInput value={character.initiative} onChange={v => onChange({ ...character, initiative: v })} />
              }
            </div>
          </div>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Speed</div>
            <div className="stat-bubble-value">
              <NumInput value={character.speed} onChange={v => onChange({ ...character, speed: v })} min={0} />
            </div>
          </div>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Hit Dice</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', textAlign: 'center' }}>
              {hitDiceString(character)}
            </div>
          </div>
        </div>

        {/* Inspiration */}
        <label
          className={`inspiration-toggle ${character.inspiration ? 'active' : ''}`}
          style={{ display: 'inline-flex', marginBottom: '1.25rem' }}
        >
          <input
            type="checkbox"
            style={{ display: 'none' }}
            checked={character.inspiration}
            onChange={e => onChange({ ...character, inspiration: e.target.checked })}
          />
          ✦ Inspiration
        </label>
      </SectionPanel>

      {/* Hit Points */}
      <SectionPanel title="Hit Points">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Max HP</div>
            <div className="stat-bubble-value">
              <NumInput value={character.hp.max} onChange={v => setHp('max', v)} min={0} />
            </div>
          </div>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Current HP</div>
            <div className="stat-bubble-value">
              <NumInput value={character.hp.current} onChange={v => setHp('current', v)} />
            </div>
          </div>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Temp HP</div>
            <div className="stat-bubble-value">
              <NumInput value={character.hp.temp} onChange={v => setHp('temp', v)} min={0} />
            </div>
          </div>
        </div>
        {character.hp.max > 0 && (
          <div className="hp-bar-container">
            <div className="hp-bar-fill" style={{ width: `${hpPct}%` }} />
          </div>
        )}
      </SectionPanel>

      {/* Death Saves */}
      <SectionPanel title="Death Saving Throws">
        {(['successes', 'failures'] as const).map(type => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', width: 80, color: type === 'failures' ? 'var(--crimson)' : 'var(--gold)' }}>
              {type === 'successes' ? 'Successes' : 'Failures'}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[1, 2, 3].map(n => (
                <span
                  key={n}
                  className={`death-save-pip ${type} ${character.deathSaves[type] >= n ? 'filled' : ''}`}
                  onClick={() => setDeathSave(type, character.deathSaves[type] === n ? n - 1 : n)}
                  title={`${n} ${type}`}
                />
              ))}
            </div>
          </div>
        ))}
      </SectionPanel>
    </div>
  )
}
