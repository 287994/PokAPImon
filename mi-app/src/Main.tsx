import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Batalla from './pages/Batalla'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Batalla />
  </StrictMode>,
)
