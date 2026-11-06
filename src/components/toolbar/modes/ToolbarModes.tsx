import { Eye, FileText, Menu, Pencil, ScrollText, Users } from 'lucide-react'

import { ToolbarButton } from '../button/ToolbarButton'
import { PopupMenu } from '../menu/PopupMenu'
import type { ModeAction } from './ModeAction'
import type { ToolbarModesProps } from './ToolbarModesProps'

/**
 * Левая группа плавающих кнопок: переход между режимами и экранами.
 *
 * В просмотре одна кнопка Редактировать. В редактировании Просмотр, Роли и Макет: на ПК это
 * отдельные кнопки, повторное нажатие на Роли или Макет возвращает к сценарию. На телефоне это
 * меню с постоянным порядком пунктов: Просмотр, Сценарий, Роли, Макет.
 */
export function ToolbarModes({ mode, screen, onModeChange, onScreenChange }: ToolbarModesProps) {
  if (mode === 'view') {
    return (
      <ToolbarButton
        icon={Pencil}
        label="Редактировать"
        showLabel
        onClick={() => onModeChange('edit')}
      />
    )
  }

  const isRolesOpen = screen === 'roles'
  const isLayoutOpen = screen === 'layout'

  const viewAction: ModeAction = {
    icon: Eye,
    label: 'Просмотр',
    onClick: () => onModeChange('view'),
  }
  const rolesAction: ModeAction = { icon: Users, label: 'Роли', isActive: isRolesOpen }
  const layoutAction: ModeAction = { icon: FileText, label: 'Макет', isActive: isLayoutOpen }
  const menuActions: ModeAction[] = [
    viewAction,
    {
      icon: ScrollText,
      label: 'Сценарий',
      isActive: screen === 'script',
      onClick: () => onScreenChange('script'),
    },
    { ...rolesAction, onClick: () => onScreenChange('roles') },
    { ...layoutAction, onClick: () => onScreenChange('layout') },
  ]

  return (
    <>
      <div className="floating-toolbar__desktop">
        <ToolbarButton {...viewAction} showLabel />
        <ToolbarButton
          {...rolesAction}
          showLabel
          onClick={() => onScreenChange(isRolesOpen ? 'script' : 'roles')}
        />
        <ToolbarButton
          {...layoutAction}
          showLabel
          onClick={() => onScreenChange(isLayoutOpen ? 'script' : 'layout')}
        />
      </div>
      <div className="floating-toolbar__mobile">
        <PopupMenu icon={Menu} label="Меню" groups={[{ actions: menuActions }]} align="left" />
      </div>
    </>
  )
}
