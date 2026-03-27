export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export type Alignment =
  | 'Lawful Good' | 'Neutral Good' | 'Chaotic Good'
  | 'Lawful Neutral' | 'True Neutral' | 'Chaotic Neutral'
  | 'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil'
  | 'Unaligned'

export type ProficiencyLevel = 0 | 1 | 2 // none, proficient, expert

export type SkillKey =
  | 'acrobatics' | 'animalHandling' | 'arcana' | 'athletics'
  | 'deception' | 'history' | 'insight' | 'intimidation'
  | 'investigation' | 'medicine' | 'nature' | 'perception'
  | 'performance' | 'persuasion' | 'religion' | 'sleightOfHand'
  | 'stealth' | 'survival'

export interface ClassEntry {
  id: string
  className: string
  subclass: string
  level: number
  hitDie: 6 | 8 | 10 | 12
  isSpellcaster: boolean
  spellcastingAbility: AbilityKey | ''
}

export interface Abilities {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export type SavingThrowProficiencies = Record<AbilityKey, boolean>
export type SkillProficiencies = Record<SkillKey, ProficiencyLevel>

export interface HitPoints {
  max: number
  current: number
  temp: number
}

export interface DeathSaves {
  successes: number
  failures: number
}

export interface Attack {
  id: string
  name: string
  attackBonus: string
  damageDice: string
  damageType: string
  range: string
  notes: string
}

export type SpellLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type SpellSlotLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface SpellSlotEntry {
  max: number
  used: number
}

export type SpellSlots = Record<SpellLevel, SpellSlotEntry>

export interface Spell {
  id: string
  name: string
  level: SpellSlotLevel
  school: string
  castingTime: string
  range: string
  components: string
  duration: string
  concentration: boolean
  ritual: boolean
  prepared: boolean
  description: string
  source: string
}

export interface EquipmentItem {
  id: string
  name: string
  quantity: number
  weight: number
  equipped: boolean
  notes: string
}

export interface Currency {
  cp: number
  sp: number
  ep: number
  gp: number
  pp: number
}

export interface Feature {
  id: string
  name: string
  source: string
  levelGained: number
  description: string
}

export interface CustomField {
  id: string
  name: string
  value: string
  fieldType: 'text' | 'number' | 'textarea'
}

export interface Character {
  id: string
  createdAt: string
  updatedAt: string
  archived: boolean
  autoCalc: boolean

  // Identity
  name: string
  race: string
  subrace: string
  classes: ClassEntry[]
  background: string
  alignment: Alignment | ''
  xp: number
  playerName: string
  campaignName: string

  // Appearance
  age: string
  height: string
  weight: string
  eyes: string
  skin: string
  hair: string

  // Core
  inspiration: boolean
  abilities: Abilities
  savingThrows: SavingThrowProficiencies
  skills: SkillProficiencies

  // Overrides (used when autoCalc off)
  proficiencyBonus: number
  initiative: number
  passivePerception: number

  // Combat
  hp: HitPoints
  ac: number
  speed: number
  deathSaves: DeathSaves

  // Attacks
  attacks: Attack[]

  // Spellcasting
  spellSaveDC: number
  spellAttackBonus: number
  spellSlots: SpellSlots
  spells: Spell[]

  // Equipment
  equipment: EquipmentItem[]
  currency: Currency

  // Features & Traits
  features: Feature[]

  // Personality
  personalityTraits: string
  ideals: string
  bonds: string
  flaws: string

  // Backstory
  backstory: string
  alliesOrganizations: string
  notes: string

  // Custom
  customFields: CustomField[]
}

// Skill → ability mapping
export const SKILL_ABILITY: Record<SkillKey, AbilityKey> = {
  acrobatics: 'dex',
  animalHandling: 'wis',
  arcana: 'int',
  athletics: 'str',
  deception: 'cha',
  history: 'int',
  insight: 'wis',
  intimidation: 'cha',
  investigation: 'int',
  medicine: 'wis',
  nature: 'int',
  perception: 'wis',
  performance: 'cha',
  persuasion: 'cha',
  religion: 'int',
  sleightOfHand: 'dex',
  stealth: 'dex',
  survival: 'wis',
}

export const SKILL_LABELS: Record<SkillKey, string> = {
  acrobatics: 'Acrobatics',
  animalHandling: 'Animal Handling',
  arcana: 'Arcana',
  athletics: 'Athletics',
  deception: 'Deception',
  history: 'History',
  insight: 'Insight',
  intimidation: 'Intimidation',
  investigation: 'Investigation',
  medicine: 'Medicine',
  nature: 'Nature',
  perception: 'Perception',
  performance: 'Performance',
  persuasion: 'Persuasion',
  religion: 'Religion',
  sleightOfHand: 'Sleight of Hand',
  stealth: 'Stealth',
  survival: 'Survival',
}

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
}

export const ABILITY_SHORT: Record<AbilityKey, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
}

export const ALIGNMENTS: Alignment[] = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
  'Unaligned',
]

export const HIT_DICE_OPTIONS: Array<6 | 8 | 10 | 12> = [6, 8, 10, 12]

export const CLASS_SUGGESTIONS = [
  'Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid',
  'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue',
  'Sorcerer', 'Warlock', 'Wizard',
]

export const SPELL_SCHOOLS = [
  'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
  'Evocation', 'Illusion', 'Necromancy', 'Transmutation',
]

export const DAMAGE_TYPES = [
  'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force',
  'Lightning', 'Necrotic', 'Piercing', 'Poison',
  'Psychic', 'Radiant', 'Slashing', 'Thunder',
]
