import type { PrintSettings } from '../types/PrintSettings'

/** Включён ли хотя бы один лист PDF. */
export function hasPdfPages(settings: PrintSettings): boolean {
  return settings.playerSheet || settings.storytellerSheet || settings.nightOrder
}
