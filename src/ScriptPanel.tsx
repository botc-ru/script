import type { DragEvent } from 'react'
import type { Role, RolesById, Team } from './types'
import type { ScriptMeta } from './scriptModel'
import { TEAM_LABELS } from './teams'
import { getActiveJinxes } from './jinx'
import './ScriptPanel.css'

const SCRIPT_TEAMS: Team[] = ['townsfolk', 'outsider', 'minion', 'demon']
const DJINN_ID = 'djinn'

interface ScriptPanelProps {
  roles: Role[]
  allRoles: RolesById
  script: ScriptMeta
  onScriptChange?: (patch: Partial<ScriptMeta>) => void
  interactive?: boolean
  onRemove?: (roleId: string) => void
  onSelectTeam?: (team: Team) => void
  onReorder?: (draggedId: string, targetId: string) => void
}

export function ScriptPanel({
  roles,
  allRoles,
  script,
  onScriptChange,
  interactive = true,
  onRemove,
  onSelectTeam,
  onReorder,
}: ScriptPanelProps) {
  function handleDragStart(event: DragEvent<HTMLButtonElement>, roleId: string) {
    event.dataTransfer.setData('text/plain', roleId)
    event.dataTransfer.effectAllowed = 'move'
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>, targetRole: Role) {
    event.preventDefault()
    const draggedId = event.dataTransfer.getData('text/plain')
    if (!draggedId) return
    const draggedRole = roles.find((role) => role.id === draggedId)
    if (!draggedRole || draggedRole.team !== targetRole.team) return
    onReorder?.(draggedId, targetRole.id)
  }

  function renderRoleCard(role: Role) {
    const content = (
      <>
        <img src={role.image} alt="" className="role-card__icon" />
        <div className="role-card__text">
          <div className="role-card__name">{role.name}</div>
          <div className="role-card__ability">{role.ability}</div>
        </div>
      </>
    )

    if (!interactive) {
      return (
        <div key={role.id} className="role-card">
          {content}
        </div>
      )
    }

    return (
      <button
        key={role.id}
        type="button"
        className="role-card"
        draggable
        onDragStart={(event) => handleDragStart(event, role.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => handleDrop(event, role)}
        onClick={() => onRemove?.(role.id)}
      >
        {content}
      </button>
    )
  }

  function renderTitle(text: string, team?: Team) {
    if (!interactive) {
      return <div className="script-panel__title script-panel__title--static">{text}</div>
    }

    return (
      <button
        type="button"
        className="script-panel__title"
        onClick={() => team && onSelectTeam?.(team)}
      >
        {text}
      </button>
    )
  }

  const fabledRoles = roles.filter((role) => role.team === 'fabled' && role.id !== DJINN_ID)
  const jinxes = getActiveJinxes(roles, allRoles)
  const djinn = allRoles[DJINN_ID]
  const showFabledSection = fabledRoles.length > 0 || jinxes.length > 0
  const travellerRoles = roles.filter((role) => role.team === 'traveller')

  return (
    <div className="script-panel">
      {interactive ? (
        <div className="script-panel__header">
          <input
            type="color"
            className="script-panel__color"
            value={script.color}
            onChange={(event) => onScriptChange?.({ color: event.target.value })}
            title="Цвет сценария"
          />
          <div className="script-panel__header-text">
            <input
              type="text"
              className="script-panel__name"
              placeholder="Название сценария"
              value={script.name}
              onChange={(event) => onScriptChange?.({ name: event.target.value })}
            />
            <input
              type="text"
              className="script-panel__author"
              placeholder="Автор"
              value={script.author}
              onChange={(event) => onScriptChange?.({ author: event.target.value })}
            />
          </div>
        </div>
      ) : (
        <div
          className="script-panel__header script-panel__header--static"
          style={{ borderLeftColor: script.color }}
        >
          <h1 className="script-panel__name script-panel__name--static">{script.name || 'Без названия'}</h1>
          {script.author && (
            <div className="script-panel__author script-panel__author--static">{script.author}</div>
          )}
        </div>
      )}

      {SCRIPT_TEAMS.map((team) => {
        const teamRoles = roles.filter((role) => role.team === team)
        return (
          <section key={team} className="script-panel__section">
            {renderTitle(`${TEAM_LABELS[team]} (${teamRoles.length})`, team)}
            <div className="script-panel__grid">{teamRoles.map(renderRoleCard)}</div>
          </section>
        )
      })}

      <hr className="script-panel__divider" />

      {showFabledSection && (
        <section className="script-panel__section">
          <div className="script-panel__grid script-panel__grid--single">
            {jinxes.length > 0 && (
              <>
                <div className="role-card">
                  <img src={djinn.image} alt="" className="role-card__icon" />
                  <div className="role-card__text">
                    <div className="role-card__name">{djinn.name}</div>
                    <div className="role-card__ability">{djinn.ability}</div>
                  </div>
                </div>

                {jinxes.map((jinx) => (
                  <div key={`${jinx.roleA.id}-${jinx.roleB.id}`} className="jinx-row">
                    <div className="jinx-row__icons">
                      <img src={jinx.roleA.image} alt="" />
                      <img src={jinx.roleB.image} alt="" />
                    </div>
                    <div className="jinx-row__text">{jinx.reason}</div>
                  </div>
                ))}
              </>
            )}

            {fabledRoles.map(renderRoleCard)}
          </div>
        </section>
      )}

      {travellerRoles.length > 0 && (
        <section className="script-panel__section">
          {renderTitle(`Рекомендуемые странники (${travellerRoles.length})`, 'traveller')}
          <div className="script-panel__grid">{travellerRoles.map(renderRoleCard)}</div>
        </section>
      )}
    </div>
  )
}
