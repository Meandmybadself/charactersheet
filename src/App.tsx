import { useEffect } from 'react'
import { StoreProvider, useStore } from '@/store/store'
import { RosterView } from '@/components/RosterView/RosterView'
import { CharacterView } from '@/components/CharacterView/CharacterView'
import { readShareHash, clearShareHash } from '@/utils/encoding'

function AppInner() {
  const { state, importCharacter } = useStore()

  // Handle shared character URL on load
  useEffect(() => {
    const shared = readShareHash()
    if (shared) {
      const confirmed = window.confirm(
        `Import shared character "${shared.name || 'Unnamed'}" into your roster?`
      )
      if (confirmed) importCharacter(shared)
      clearShareHash()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state.view === 'character' && state.activeId
    ? <CharacterView />
    : <RosterView />
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  )
}
