import type { PrintSettings } from './PrintSettings'
import type { RolesById } from './RolesById'
import type { ScriptData } from './ScriptData'

export interface ScriptPdfData {
  script: ScriptData
  roles: RolesById
  settings: PrintSettings
}
