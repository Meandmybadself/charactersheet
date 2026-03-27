import LZString from 'lz-string'
import type { Character } from '@/types/character'
import { createCharacter } from '@/utils/defaults'

const HASH_KEY = 'c'

export function encodeCharacter(character: Character): string {
  const json = JSON.stringify(character)
  return LZString.compressToEncodedURIComponent(json)
}

export function decodeCharacter(encoded: string): Character | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    const parsed = JSON.parse(json) as Partial<Character>
    // Merge into defaults so missing fields from old versions are populated
    return createCharacter(parsed)
  } catch {
    return null
  }
}

export function buildShareURL(character: Character): string {
  const encoded = encodeCharacter(character)
  const url = new URL(window.location.href)
  url.hash = `${HASH_KEY}=${encoded}`
  return url.toString()
}

export function readShareHash(): Character | null {
  const hash = window.location.hash.slice(1)
  if (!hash.startsWith(`${HASH_KEY}=`)) return null
  const encoded = hash.slice(HASH_KEY.length + 1)
  return decodeCharacter(encoded)
}

export function clearShareHash(): void {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
