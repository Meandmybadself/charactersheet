import { useState, useRef, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useStore } from '@/store/store'
import type { Character } from '@/types/character'
import { CharacterNav, NAV_SECTIONS } from './CharacterNav'
import type { SectionId } from './CharacterNav'
import { HeaderSection } from './sections/HeaderSection'
import { AbilityScores } from './sections/AbilityScores'
import { CombatStats } from './sections/CombatStats'
import { SavingThrows } from './sections/SavingThrows'
import { AttacksSection } from './sections/AttacksSection'
import { SpellcastingSection } from './sections/SpellcastingSection'
import { EquipmentSection } from './sections/EquipmentSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { PersonalitySection } from './sections/PersonalitySection'
import { BackstorySection } from './sections/BackstorySection'
import { CustomFieldsSection } from './sections/CustomFieldsSection'
import { Modal } from '@/components/shared/Modal'
import { buildShareURL } from '@/utils/encoding'
import { totalLevel } from '@/utils/calc'

export function CharacterView() {
  const { activeCharacter, updateCharacter, archiveCharacter, goToRoster } = useStore()
  const [activeSection, setActiveSection] = useState<SectionId>('header')
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: activeCharacter ? `${activeCharacter.name} - Character Sheet` : 'Character Sheet',
  })

  const handleChange = useCallback((c: Character) => {
    updateCharacter(c)
  }, [updateCharacter])

  if (!activeCharacter) return null

  const character = activeCharacter
  const lvl = totalLevel(character)
  const classStr = character.classes.map(c => `${c.className} ${c.level}`).join(' / ') || ''
  // Only compute share URL when the modal is open
  const shareUrl = showShare ? buildShareURL(character) : ''

  async function copyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select the input
    }
  }

  function renderSection() {
    switch (activeSection) {
      case 'header':       return <HeaderSection character={character} onChange={handleChange} />
      case 'abilities':    return <AbilityScores character={character} onChange={handleChange} />
      case 'combat':       return <CombatStats character={character} onChange={handleChange} />
      case 'saves-skills': return <SavingThrows character={character} onChange={handleChange} />
      case 'attacks':      return <AttacksSection character={character} onChange={handleChange} />
      case 'spellcasting': return <SpellcastingSection character={character} onChange={handleChange} />
      case 'equipment':    return <EquipmentSection character={character} onChange={handleChange} />
      case 'features':     return <FeaturesSection character={character} onChange={handleChange} />
      case 'personality':  return <PersonalitySection character={character} onChange={handleChange} />
      case 'backstory':    return <BackstorySection character={character} onChange={handleChange} />
      case 'custom':       return <CustomFieldsSection character={character} onChange={handleChange} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Top bar */}
      <div className="char-topbar no-print">
        <button className="btn btn-ghost btn-icon" onClick={goToRoster} title="Back to Roster" style={{ flexShrink: 0 }}>
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="char-topbar-name">{character.name || 'Unnamed Character'}</div>
          {(classStr || lvl > 0) && (
            <div className="char-topbar-sub">{classStr}{lvl > 0 ? ` · Lvl ${lvl}` : ''}</div>
          )}
        </div>
        {character.autoCalc && <span className="autocalc-badge no-print">⚙ Auto</span>}
        <button className="btn btn-ghost" onClick={() => setShowShare(true)} title="Share Character URL" style={{ flexShrink: 0 }}>
          🔗 Share
        </button>
        <button className="btn btn-ghost" onClick={() => handlePrint()} title="Print / Save as PDF" style={{ flexShrink: 0 }}>
          🖨 Print
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            if (confirm(`Archive "${character.name || 'this character'}"? You can restore them from the roster.`)) {
              archiveCharacter(character.id)
            }
          }}
          title="Archive Character"
          style={{ color: 'var(--ink-light)', flexShrink: 0 }}
        >
          🗃
        </button>
      </div>

      {/* Mobile section tabs */}
      <CharacterNav active={activeSection} onChange={setActiveSection} variant="tabs" />

      {/* Body */}
      <div className="char-layout" style={{ flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div className="char-sidebar no-print">
          <CharacterNav active={activeSection} onChange={setActiveSection} variant="sidebar" />
        </div>

        {/* Content */}
        <div className="char-content" ref={printRef}>
          {/* Print header */}
          <div className="print-only" style={{ display: 'none', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            <h1 style={{ fontSize: '1.5rem' }}>{character.name}</h1>
            <p style={{ color: 'var(--ink-light)', fontSize: '0.9rem' }}>{classStr}{lvl > 0 ? ` · Level ${lvl}` : ''} · {character.race}</p>
          </div>

          {renderSection()}

          {/* Print: show all sections */}
          <div className="print-all-sections" style={{ display: 'none' }}>
            {NAV_SECTIONS.filter(s => s.id !== activeSection).map(s => (
              <div key={s.id} style={{ marginTop: '1.5rem' }}>
                {s.id === 'header' && <HeaderSection character={character} onChange={() => {}} />}
                {s.id === 'abilities' && <AbilityScores character={character} onChange={() => {}} />}
                {s.id === 'combat' && <CombatStats character={character} onChange={() => {}} />}
                {s.id === 'saves-skills' && <SavingThrows character={character} onChange={() => {}} />}
                {s.id === 'attacks' && <AttacksSection character={character} onChange={() => {}} />}
                {s.id === 'spellcasting' && <SpellcastingSection character={character} onChange={() => {}} />}
                {s.id === 'equipment' && <EquipmentSection character={character} onChange={() => {}} />}
                {s.id === 'features' && <FeaturesSection character={character} onChange={() => {}} />}
                {s.id === 'personality' && <PersonalitySection character={character} onChange={() => {}} />}
                {s.id === 'backstory' && <BackstorySection character={character} onChange={() => {}} />}
                {s.id === 'custom' && <CustomFieldsSection character={character} onChange={() => {}} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <Modal
          title="Share Character"
          onClose={() => { setShowShare(false); setCopied(false) }}
          actions={<button className="btn" onClick={() => { setShowShare(false); setCopied(false) }}>Close</button>}
        >
          <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            Share this URL to let others view and import <strong>{character.name}</strong> into their roster.
            The character data is encoded directly in the URL — no account needed.
          </p>
          <div className="share-url-box">
            <input
              className="share-url-input"
              readOnly
              value={shareUrl}
              onFocus={e => e.target.select()}
            />
            <button className="btn btn-primary" onClick={copyShareUrl}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
