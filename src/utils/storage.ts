import type { Character } from '@/types/character'

const STORAGE_KEY = 'dnd-roster-v1'

export function loadRoster(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Character[]
  } catch {
    return []
  }
}

export function saveRoster(roster: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roster))
  } catch {
    console.error('Failed to save roster to localStorage')
  }
}
