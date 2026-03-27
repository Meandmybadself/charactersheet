import type { Character, AbilityKey } from '@/types/character'
import { ABILITY_SHORT, ABILITY_LABELS } from '@/types/character'
import { abilityMod, formatMod, proficiencyBonus } from '@/utils/calc'
import { SectionPanel } from '@/components/shared/SectionPanel'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

const ABILITIES: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export function AbilityScores({ character, onChange }: Props) {
  function setAbility(key: AbilityKey, value: number) {
    onChange({ ...character, abilities: { ...character.abilities, [key]: value } })
  }

  function setProfBonus(value: number) {
    onChange({ ...character, proficiencyBonus: value })
  }

  const profBonus = proficiencyBonus(character)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SectionPanel title="Ability Scores">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          {ABILITIES.map(key => {
            const score = character.abilities[key]
            const mod = abilityMod(score)
            return (
              <div key={key} className="ability-box" title={ABILITY_LABELS[key]}>
                <div className="ability-box-label">{ABILITY_SHORT[key]}</div>
                <div className="ability-box-mod">{formatMod(mod)}</div>
                <div className="ability-box-score">
                  <input
                    type="number"
                    value={score}
                    onChange={e => setAbility(key, Math.max(1, Math.min(30, Number(e.target.value))))}
                    min={1}
                    max={30}
                    aria-label={ABILITY_LABELS[key]}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </SectionPanel>

      <SectionPanel title="Proficiency Bonus">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Prof. Bonus</div>
            <div className="stat-bubble-value">
              {character.autoCalc
                ? formatMod(profBonus)
                : <input
                    type="number"
                    value={character.proficiencyBonus}
                    onChange={e => setProfBonus(Number(e.target.value))}
                    min={1}
                    max={9}
                    style={{ width: 52, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', outline: 'none', color: 'var(--ink)' }}
                  />
              }
            </div>
          </div>
          {character.autoCalc && (
            <p className="text-muted" style={{ fontSize: '0.78rem' }}>
              Proficiency bonus is {formatMod(profBonus)} based on total level. Toggle auto-calc off in the Identity section to set manually.
            </p>
          )}
        </div>
      </SectionPanel>
    </div>
  )
}
