import type { Style } from '@react-pdf/types'
import type { ReactNode } from 'react'

export interface SheetPageProps {
  style?: Style
  children: ReactNode
}
