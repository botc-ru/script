import type { ReactNode } from 'react'

export interface SheetSettingsProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  children?: ReactNode
}
