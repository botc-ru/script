import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { RolesProvider } from './contexts/roles/RolesProvider'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <RolesProvider>
      <App />
    </RolesProvider>
  </StrictMode>,
)
