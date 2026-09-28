import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Fix the cover pages' height once (see .page-cover). Only a width change
// (rotating the phone) re-measures it; address-bar height changes don't.
{
  let width = 0
  const setCoverHeight = () => {
    if (window.innerWidth === width) return
    width = window.innerWidth
    document.documentElement.style.setProperty('--cover-h', `${window.innerHeight}px`)
  }
  setCoverHeight()
  window.addEventListener('resize', setCoverHeight)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
