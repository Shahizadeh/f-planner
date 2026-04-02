import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { registerPWA } from './app/providers/pwa'
import './app/styles/index.css'

registerPWA()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
