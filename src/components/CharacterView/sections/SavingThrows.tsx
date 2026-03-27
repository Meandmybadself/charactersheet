import type { Character, AbilityKey } from '@/types/character'
import { ABILITY_SHORT } from '@/types/character'
import { savingThrowBonus, skillBonus, passivePerception, formatMod } from '@/utils/calc'
import { SKILL_LABELS, SKILL_ABILITY } from '@/types/character'
import type { SkillKey, ProficiencyLevel } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

const ABILITIES: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const SKILLS = Object.keys(SKILL_LABELS) as SkillKey[]

function ProfDot({ level, onClick }: { level: ProficiencyLevel; onClick: () => void }) {
  return (
    <span
      className={`prof-dot ${level === 1 ? 'full' : level === 2 ? 'full' : ''}`}
      style={level === 2 ? { background: 'var(--gold)', border: '2px solid var(--gold-light)', boxShadow: '0 0 0 2px var(--gold)' } : {}}
      onClick={onClick}
      title={level === 0 ? 'Not proficient' : level === 1 ? 'Proficient' : 'Expert'}
    />
  )
}

export function SavingThrows({ character, onChange }: Props) {
  function toggleSave(ability: AbilityKey) {
    onChange({
      ...character,
      savingThrows: { ...character.savingThrows, [ability]: !character.savingThrows[ability] },
    })
  }

  function cycleSkill(skill: SkillKey) {
    const current = character.skills[skill]
    const next: ProficiencyLevel = current === 0 ? 1 : current === 1 ? 2 : 0
    onChange({ ...character, skills: { ...character.skills, [skill]: next } })
  }

  const passPerc = passivePerception(character)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <SectionPanel title="Saving Throws">
        <div style={{ columns: 2, columnGap: '1rem' }}>
          {ABILITIES.map(key => {
            const bonus = savingThrowBonus(character, key)
            const proficient = character.savingThrows[key]
            return (
              <div key={key} className="prof-row" onClick={() => toggleSave(key)} style={{ cursor: 'pointer', breakInside: 'avoid' }}>
                <span className={`prof-dot ${proficient ? 'full' : ''}`} />
                <span className="prof-row-value">{formatMod(bonus)}</span>
                <span className="prof-row-label">{ABILITY_SHORT[key]}</span>
              </div>
            )
          })}
        </div>
      </SectionPanel>

      <SectionPanel title="Skills">
        <p className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '0.75rem' }}>
          Tap dot to cycle: none → proficient → expert
        </p>
        <div style={{ columns: 2, columnGap: '1.5rem' }}>
          {SKILLS.map(skill => {
            const bonus = skillBonus(character, skill)
            const level = character.skills[skill]
            const abilityKey = SKILL_ABILITY[skill]
            return (
              <div key={skill} className="prof-row" style={{ breakInside: 'avoid' }}>
                <ProfDot level={level} onClick={() => cycleSkill(skill)} />
                <span className="prof-row-value">{formatMod(bonus)}</span>
                <span className="prof-row-label">{SKILL_LABELS[skill]}</span>
                <span className="prof-row-ability">({ABILITY_SHORT[abilityKey]})</span>
              </div>
            )
          })}
        </div>
      </SectionPanel>

      <SectionPanel title="Passive Perception">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-bubble">
            <div className="stat-bubble-label">Passive Perc.</div>
            <div className="stat-bubble-value">
              {character.autoCalc
                ? passPerc
                : <input
                    type="number"
                    value={character.passivePerception}
                    onChange={e => onChange({ ...character, passivePerception: Number(e.target.value) })}
                    style={{ width: 52, textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', outline: 'none', color: 'var(--ink)' }}
                  />
              }
            </div>
          </div>
          {character.autoCalc && (
            <p className="text-muted" style={{ fontSize: '0.78rem' }}>
              10 + Perception skill bonus
            </p>
          )}
        </div>
      </SectionPanel>
    </div>
  )
}
