import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Character } from '@/types/character'
import { loadRoster, saveRoster } from '@/utils/storage'
import { createCharacter } from '@/utils/defaults'

type View = 'roster' | 'character'

interface State {
  roster: Character[]
  activeId: string | null
  view: View
}

type Action =
  | { type: 'CREATE'; character: Character }
  | { type: 'UPDATE'; character: Character }
  | { type: 'ARCHIVE'; id: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'IMPORT'; character: Character }
  | { type: 'SET_ACTIVE'; id: string }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'LOAD'; roster: Character[] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return { ...state, roster: action.roster }

    case 'CREATE': {
      const roster = [...state.roster, action.character]
      return { ...state, roster, activeId: action.character.id, view: 'character' }
    }

    case 'UPDATE': {
      const updated = { ...action.character, updatedAt: new Date().toISOString() }
      return {
        ...state,
        roster: state.roster.map(c => c.id === updated.id ? updated : c),
      }
    }

    case 'ARCHIVE':
      return {
        ...state,
        roster: state.roster.map(c =>
          c.id === action.id ? { ...c, archived: true, updatedAt: new Date().toISOString() } : c
        ),
        ...(state.activeId === action.id ? { activeId: null, view: 'roster' } : {}),
      }

    case 'RESTORE':
      return {
        ...state,
        roster: state.roster.map(c =>
          c.id === action.id ? { ...c, archived: false, updatedAt: new Date().toISOString() } : c
        ),
      }

    case 'DELETE':
      return {
        ...state,
        roster: state.roster.filter(c => c.id !== action.id),
        ...(state.activeId === action.id ? { activeId: null, view: 'roster' } : {}),
      }

    case 'IMPORT': {
      // Always assign a fresh ID to avoid silently overwriting an existing character
      const imported = { ...action.character, id: uuidv4() }
      return { ...state, roster: [...state.roster, imported], activeId: imported.id, view: 'character' }
    }

    case 'SET_ACTIVE':
      return { ...state, activeId: action.id, view: 'character' }

    case 'SET_VIEW':
      return { ...state, view: action.view, ...(action.view === 'roster' ? { activeId: null } : {}) }

    default:
      return state
  }
}

interface StoreContext {
  state: State
  activeCharacter: Character | null
  createCharacter: (name: string, autoCalc: boolean) => void
  updateCharacter: (character: Character) => void
  archiveCharacter: (id: string) => void
  restoreCharacter: (id: string) => void
  deleteCharacter: (id: string) => void
  importCharacter: (character: Character) => void
  openCharacter: (id: string) => void
  goToRoster: () => void
}

const Context = createContext<StoreContext | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    roster: [],
    activeId: null,
    view: 'roster',
  })

  const loaded = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    const roster = loadRoster()
    dispatch({ type: 'LOAD', roster })
    loaded.current = true
  }, [])

  // Persist to localStorage only after initial load completes
  useEffect(() => {
    if (!loaded.current) return
    saveRoster(state.roster)
  }, [state.roster])

  const activeCharacter = state.roster.find(c => c.id === state.activeId) ?? null

  const ctx: StoreContext = {
    state,
    activeCharacter,
    createCharacter: useCallback((name: string, autoCalc: boolean) => {
      dispatch({ type: 'CREATE', character: createCharacter({ name, autoCalc }) })
    }, []),
    updateCharacter: useCallback((character: Character) => {
      dispatch({ type: 'UPDATE', character })
    }, []),
    archiveCharacter: useCallback((id: string) => {
      dispatch({ type: 'ARCHIVE', id })
    }, []),
    restoreCharacter: useCallback((id: string) => {
      dispatch({ type: 'RESTORE', id })
    }, []),
    deleteCharacter: useCallback((id: string) => {
      dispatch({ type: 'DELETE', id })
    }, []),
    importCharacter: useCallback((character: Character) => {
      dispatch({ type: 'IMPORT', character })
    }, []),
    openCharacter: useCallback((id: string) => {
      dispatch({ type: 'SET_ACTIVE', id })
    }, []),
    goToRoster: useCallback(() => {
      dispatch({ type: 'SET_VIEW', view: 'roster' })
    }, []),
  }

  return <Context.Provider value={ctx}>{children}</Context.Provider>
}

export function useStore(): StoreContext {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
