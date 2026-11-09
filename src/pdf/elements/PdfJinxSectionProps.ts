import type { Style } from '@react-pdf/types'

import type { ActiveJinx } from '../../types/ActiveJinx'

export interface PdfJinxSectionProps {
  jinxes: ActiveJinx[]
  columns: 1 | 2
  titleStyle?: Style
}
