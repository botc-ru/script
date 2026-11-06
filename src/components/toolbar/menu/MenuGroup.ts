import type { ModeAction } from '../modes/ModeAction'

export interface MenuGroup {
  title?: string
  actions: ModeAction[]
}
