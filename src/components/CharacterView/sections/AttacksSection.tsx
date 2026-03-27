import { v4 as uuidv4 } from 'uuid'
import type { Character, Attack } from '@/types/character'
import { DAMAGE_TYPES } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

function emptyAttack(): Attack {
  return { id: uuidv4(), name: '', attackBonus: '', damageDice: '', damageType: '', range: '', notes: '' }
}

export function AttacksSection({ character, onChange }: Props) {
  function updateAttack(id: string, updates: Partial<Attack>) {
    onChange({ ...character, attacks: character.attacks.map(a => a.id === id ? { ...a, ...updates } : a) })
  }

  function removeAttack(id: string) {
    onChange({ ...character, attacks: character.attacks.filter(a => a.id !== id) })
  }

  return (
    <SectionPanel
      title="Attacks"
      actions={
        <button className="btn btn-ghost" style={{ padding: '0 0.5rem', fontSize: '0.75rem', minHeight: 28 }}
          onClick={() => onChange({ ...character, attacks: [...character.attacks, emptyAttack()] })}>
          + Add
        </button>
      }
    >
      {character.attacks.length === 0
        ? <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>No attacks yet.</p>
        : (
          <div style={{ overflowX: 'auto' }}>
            <table className="fantasy-table" style={{ minWidth: 580 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Attack Bonus</th>
                  <th>Damage</th>
                  <th>Type</th>
                  <th>Range</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {character.attacks.map(attack => (
                  <tr key={attack.id}>
                    <td><input value={attack.name} onChange={e => updateAttack(attack.id, { name: e.target.value })} placeholder="Longsword" /></td>
                    <td><input value={attack.attackBonus} onChange={e => updateAttack(attack.id, { attackBonus: e.target.value })} placeholder="+5" style={{ width: 56 }} /></td>
                    <td><input value={attack.damageDice} onChange={e => updateAttack(attack.id, { damageDice: e.target.value })} placeholder="1d8+3" style={{ width: 72 }} /></td>
                    <td>
                      <select value={attack.damageType} onChange={e => updateAttack(attack.id, { damageType: e.target.value })} style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', background: 'transparent', border: 'none', outline: 'none', color: 'var(--ink)', cursor: 'pointer' }}>
                        <option value="">—</option>
                        {DAMAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td><input value={attack.range} onChange={e => updateAttack(attack.id, { range: e.target.value })} placeholder="5 ft" style={{ width: 56 }} /></td>
                    <td><input value={attack.notes} onChange={e => updateAttack(attack.id, { notes: e.target.value })} placeholder="Finesse, light..." /></td>
                    <td>
                      <button onClick={() => removeAttack(attack.id)} style={{ background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem', minHeight: 32, minWidth: 32 }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </SectionPanel>
  )
}
