import { useEffect, useState } from 'react'
import type { RolesById } from './types'

const ROLES_URL = 'https://raw.githubusercontent.com/botc-ru/data/main/roles.json'

interface RolesState {
  roles: RolesById
  loading: boolean
  error: string | null
}

export function useRoles(): RolesState {
  const [roles, setRoles] = useState<RolesById>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadRoles() {
      try {
        const response = await fetch(ROLES_URL)
        if (!response.ok) {
          throw new Error(`Failed to load roles: ${response.status}`)
        }
        const data = (await response.json()) as RolesById
        if (!cancelled) {
          setRoles(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadRoles()

    return () => {
      cancelled = true
    }
  }, [])

  return { roles, loading, error }
}
