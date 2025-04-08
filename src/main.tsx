import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SiteHeader from '../public/SiteHeader.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteHeader />
    <App />
  </StrictMode>,
)
