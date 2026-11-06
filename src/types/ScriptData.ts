export interface ScriptData {
  name: string
  author: string
  color: string
  roleIds: string[]
  /** Показывать роли в порядке `roleIds`. Иначе они сортируются автоматически. */
  customOrder: boolean
}
