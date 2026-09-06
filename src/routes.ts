const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export const ROOT_PATH = `${BASE}/`
export const EDIT_PATH = `${BASE}/edit`

export function isEditPath(path: string): boolean {
  return path.replace(/\/$/, '') === EDIT_PATH
}
