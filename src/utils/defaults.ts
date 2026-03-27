import { v4 as uuidv4 } from 'uuid'
import type { Character, SkillKey, AbilityKey, SpellLevel } from '@/types/character'

const defaultSkills = (): Character['skills'] => ({
  acrobatics: 0, animalHandling: 0, arcana: 0, athletics: 0,
  deception: 0, history: 0, insight: 0, intimidation: 0,
  investigation: 0, medicine: 0, nature: 0, perception: 0,
  performance: 0, persuasion: 0, religion: 0, sleightOfHand: 0,
  stealth: 0, survival: 0,
} as Record<SkillKey, 0>)

const defaultSavingThrows = (): Character['savingThrows'] => ({
  str: false, dex: false, con: false, int: false, wis: false, cha: false,
} as Record<AbilityKey, boolean>)

const defaultSpellSlots = (): Character['spellSlots'] => {
  const slots = {} as Character['spellSlots']
  for (let i = 1; i <= 9; i++) {
    slots[i as SpellLevel] = { max: 0, used: 0 }
  }
  return slots
}

export function createCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
    autoCalc: true,

    name: '',
    race: '',
    subrace: '',
    classes: [],
    background: '',
    alignment: '',
    xp: 0,
    playerName: '',
    campaignName: '',

    age: '',
    height: '',
    weight: '',
    eyes: '',
    skin: '',
    hair: '',

    inspiration: false,
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    savingThrows: defaultSavingThrows(),
    skills: defaultSkills(),

    proficiencyBonus: 2,
    initiative: 0,
    passivePerception: 10,

    hp: { max: 0, current: 0, temp: 0 },
    ac: 10,
    speed: 30,
    deathSaves: { successes: 0, failures: 0 },

    attacks: [],

    spellSaveDC: 8,
    spellAttackBonus: 0,
    spellSlots: defaultSpellSlots(),
    spells: [],

    equipment: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },

    features: [],

    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',

    backstory: '',
    alliesOrganizations: '',
    notes: '',

    customFields: [],

    ...overrides,
  }
}
