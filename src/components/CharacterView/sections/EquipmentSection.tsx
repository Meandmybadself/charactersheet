import { v4 as uuidv4 } from 'uuid'
import type { Character, EquipmentItem } from '@/types/character'
import { SectionPanel } from '@/components/shared/SectionPanel'
import { totalCarryCapacity, totalEquipmentWeight, gpValue } from '@/utils/calc'

interface Props {
  character: Character
  onChange: (c: Character) => void
}

function emptyItem(): EquipmentItem {
  return { id: uuidv4(), name: '', quantity: 1, weight: 0, equipped: false, notes: '' }
}

export function EquipmentSection({ character, onChange }: Props) {
  function updateItem(id: string, updates: Partial<EquipmentItem>) {
    onChange({ ...character, equipment: character.equipment.map(i => i.id === id ? { ...i, ...updates } : i) })
  }

  function removeItem(id: string) {
    onChange({ ...character, equipment: character.equipment.filter(i => i.id !== id) })
  }

  function setCurrency(key: keyof typeof character.currency, value: number) {
    onChange({ ...character, currency: { ...character.currency, [key]: Math.max(0, value) } })
  }

  const totalWeight = totalEquipmentWeight(character)
  const capacity = totalCarryCapacity(character)
  const gp = gpValue(character.currency)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Currency */}
      <SectionPanel title="Currency">
        <div className="currency-row">
          {(['cp', 'sp', 'ep', 'gp', 'pp'] as const).map(coin => (
            <div key={coin} className="currency-coin">
              <span className={`currency-coin-label ${coin}`}>{coin.toUpperCase()}</span>
              <input
                type="number"
                value={character.currency[coin]}
                onChange={e => setCurrency(coin, Number(e.target.value))}
                min={0}
              />
            </div>
          ))}
        </div>
        <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.78rem' }}>
          Total value: {gp.toFixed(2)} gp
        </p>
      </SectionPanel>

      {/* Equipment list */}
      <SectionPanel
        title="Equipment"
        actions={
          <button className="btn btn-ghost" style={{ padding: '0 0.5rem', fontSize: '0.75rem', minHeight: 28 }}
            onClick={() => onChange({ ...character, equipment: [...character.equipment, emptyItem()] })}>
            + Add
          </button>
        }
      >
        {totalWeight > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="text-muted" style={{ fontSize: '0.78rem' }}>
              Carrying {totalWeight.toFixed(1)} / {capacity} lbs
            </span>
            {totalWeight > capacity && (
              <span style={{ color: 'var(--crimson)', fontSize: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                ⚠ Encumbered
              </span>
            )}
          </div>
        )}
        {character.equipment.length === 0
          ? <p className="text-muted" style={{ textAlign: 'center', padding: '1rem 0' }}>No items yet.</p>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table className="fantasy-table" style={{ minWidth: 480 }}>
                <thead>
                  <tr>
                    <th>✓</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Weight</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {character.equipment.map(item => (
                    <tr key={item.id} style={{ opacity: item.equipped ? 1 : 0.65 }}>
                      <td>
                        <input
                          type="checkbox"
                          className="field-checkbox"
                          checked={item.equipped}
                          onChange={e => updateItem(item.id, { equipped: e.target.checked })}
                          title="Equipped"
                        />
                      </td>
                      <td><input value={item.name} onChange={e => updateItem(item.id, { name: e.target.value })} placeholder="Item name" /></td>
                      <td><input type="number" value={item.quantity} onChange={e => updateItem(item.id, { quantity: Math.max(0, Number(e.target.value)) })} min={0} style={{ width: 48 }} /></td>
                      <td><input type="number" value={item.weight} onChange={e => updateItem(item.id, { weight: Math.max(0, Number(e.target.value)) })} min={0} step={0.5} style={{ width: 56 }} /></td>
                      <td><input value={item.notes} onChange={e => updateItem(item.id, { notes: e.target.value })} placeholder="Notes..." /></td>
                      <td>
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem', minHeight: 32, minWidth: 32 }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </SectionPanel>
    </div>
  )
}
