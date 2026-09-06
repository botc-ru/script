export interface ScriptData {
  name: string
  author: string
  color: string
  roleIds: string[]
}

export type ScriptMeta = Pick<ScriptData, 'name' | 'author' | 'color'>

export const DEFAULT_SCRIPT_DATA: ScriptData = {
  name: '',
  author: '',
  color: '#8b1e1e',
  roleIds: [],
}
