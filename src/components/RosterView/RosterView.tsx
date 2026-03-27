import { useState } from 'react'
import { useStore } from '@/store/store'
import { CharacterCard } from './CharacterCard'
import { Modal } from '@/components/shared/Modal'
import { Field } from '@/components/shared/Field'

export function RosterView() {
  const { state, createCharacter } = useStore()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [autoCalc, setAutoCalc] = useState(true)
  const [showArchived, setShowArchived] = useState(false)

  const active = state.roster.filter(c => !c.archived)
  const archived = state.roster.filter(c => c.archived)

  function handleCreate() {
    if (!newName.trim()) return
    createCharacter(newName.trim(), autoCalc)
    setNewName('')
    setAutoCalc(true)
    setShowCreate(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header className="roster-header">
        <div>
          <h1 className="roster-title">⚔ Character Roster</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          + New Character
        </button>
      </header>

      <div className="roster-grid">
        {active.length === 0 && (
          <div className="roster-empty">
            <div className="roster-empty-title">No adventurers yet</div>
            <p className="text-muted">Create your first character to begin.</p>
          </div>
        )}
        {active.map(c => <CharacterCard key={c.id} character={c} />)}

        {archived.length > 0 && (
          <>
            <button
              className="roster-section-label"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.5rem 0' }}
              onClick={() => setShowArchived(v => !v)}
            >
              {showArchived ? '▾' : '▸'} Archived ({archived.length})
            </button>
            {showArchived && archived.map(c => <CharacterCard key={c.id} character={c} />)}
          </>
        )}
      </div>

      {showCreate && (
        <Modal
          title="New Character"
          onClose={() => setShowCreate(false)}
          actions={
            <>
              <button className="btn" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!newName.trim()}>
                Create
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field
              label="Character Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
              autoFocus
              placeholder="Enter a name..."
            />
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Auto-Calculate Stats?
              </label>
              <p className="text-muted" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                Automatically compute modifiers, proficiency bonuses, passive perception, and spell DCs from your ability scores and level.
              </p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={autoCalc}
                    onChange={e => setAutoCalc(e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem' }}>
                  {autoCalc ? 'Enabled — stats computed automatically' : 'Disabled — enter all values manually'}
                </span>
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
