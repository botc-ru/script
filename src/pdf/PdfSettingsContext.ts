import { createContext } from 'react'

import { DEFAULT_PRINT_SETTINGS } from '../utils/defaultPrintSettings'

export const PdfSettingsContext = createContext(DEFAULT_PRINT_SETTINGS)
