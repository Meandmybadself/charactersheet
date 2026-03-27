import { useState } from 'react'
import { useStore } from '@/store/store'
import type { Character } from '@/types/character'
import { totalLevel } from '@/utils/calc'

interface Props { character: Character }

export function CharacterCard({ character }: Props) {
  const { openCharacter, archiveCharacter, restoreCharacter, deleteCharacter } = useStore()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const lvl = totalLevel(character)
  const classStr = character.classes.map(c => `${c.className} ${c.level}`).join(' / ') || 'No class'
  const raceStr = [character.subrace, character.race].filter(Boolean).join(' ') || 'No race'

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirmDelete) {
      deleteCharacter(character.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div
      className={`character-card ${character.archived ? 'archived' : ''}`}
      onClick={() => openCharacter(character.id)}
    >
      <div className="character-card-menu" onClick={e => e.stopPropagation()}>
        {character.archived ? (
          <button
            className="btn btn-ghost btn-icon"
            title="Restore"
            onClick={() => restoreCharacter(character.id)}
            style={{ fontSize: '0.9rem' }}
          >
            ↩
          </button>
        ) : (
          <button
            className="btn btn-ghost btn-icon"
            title="Archive"
            onClick={(e) => { e.stopPropagation(); archiveCharacter(character.id) }}
            style={{ fontSize: '0.9rem', color: 'var(--ink-light)' }}
          >
            🗃
          </button>
        )}
        <button
          className={`btn btn-ghost btn-icon ${confirmDelete ? 'btn-danger' : ''}`}
          title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          onClick={handleDelete}
          style={{ fontSize: '0.9rem', color: confirmDelete ? 'var(--crimson)' : 'var(--ink-light)' }}
        >
          {confirmDelete ? '✓' : '✕'}
        </button>
      </div>

      <div className="character-card-name">{character.name || 'Unnamed'}</div>
      <div className="character-card-sub">{raceStr}</div>
      <div className="character-card-sub">{classStr}</div>
      {lvl > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <span className="character-card-badge">Lvl {lvl}</span>
          {character.archived && <span className="character-card-badge" style={{ marginLeft: '0.4rem', color: 'var(--ink-light)' }}>Archived</span>}
        </div>
      )}
    </div>
  )
}
