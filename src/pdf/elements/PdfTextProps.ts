import type { Style } from '@react-pdf/types'

export interface PdfTextProps {
  /** Модификации роли: идут после текста жирным шрифтом в квадратных скобках. */
  modifications?: string
  style?: Style
  children: string
}
