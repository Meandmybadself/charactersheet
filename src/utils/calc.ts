import type { Character, AbilityKey, SkillKey } from '@/types/character'
import { SKILL_ABILITY } from '@/types/character'

export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function formatMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function totalLevel(character: Character): number {
  return character.classes.reduce((sum, c) => sum + c.level, 0)
}

export function proficiencyBonus(character: Character): number {
  if (!character.autoCalc) return character.proficiencyBonus
  const lvl = Math.max(1, totalLevel(character))
  return Math.ceil(lvl / 4) + 1
}

export function savingThrowBonus(character: Character, ability: AbilityKey): number {
  const mod = abilityMod(character.abilities[ability])
  const prof = character.savingThrows[ability] ? proficiencyBonus(character) : 0
  return mod + prof
}

export function skillBonus(character: Character, skill: SkillKey): number {
  const ability = SKILL_ABILITY[skill]
  const mod = abilityMod(character.abilities[ability])
  const level = character.skills[skill]
  const prof = proficiencyBonus(character)
  return mod + prof * level
}

export function initiativeBonus(character: Character): number {
  if (!character.autoCalc) return character.initiative
  return abilityMod(character.abilities.dex)
}

export function passivePerception(character: Character): number {
  if (!character.autoCalc) return character.passivePerception
  return 10 + skillBonus(character, 'perception')
}

export function spellSaveDC(character: Character): number {
  if (!character.autoCalc) return character.spellSaveDC
  const spellcaster = character.classes.find(c => c.isSpellcaster && c.spellcastingAbility)
  if (!spellcaster || !spellcaster.spellcastingAbility) return 8
  return 8 + proficiencyBonus(character) + abilityMod(character.abilities[spellcaster.spellcastingAbility])
}

export function spellAttackBonus(character: Character): number {
  if (!character.autoCalc) return character.spellAttackBonus
  const spellcaster = character.classes.find(c => c.isSpellcaster && c.spellcastingAbility)
  if (!spellcaster || !spellcaster.spellcastingAbility) return 0
  return proficiencyBonus(character) + abilityMod(character.abilities[spellcaster.spellcastingAbility])
}

export function hitDiceString(character: Character): string {
  return character.classes
    .filter(c => c.level > 0)
    .map(c => `${c.level}d${c.hitDie}`)
    .join(' + ') || '—'
}

export function totalCarryCapacity(character: Character): number {
  return character.abilities.str * 15
}

export function totalEquipmentWeight(character: Character): number {
  return character.equipment.reduce((sum, item) => sum + item.weight * item.quantity, 0)
}

export function gpValue(currency: Character['currency']): number {
  return (
    currency.pp * 10 +
    currency.gp +
    currency.ep * 0.5 +
    currency.sp * 0.1 +
    currency.cp * 0.01
  )
}
