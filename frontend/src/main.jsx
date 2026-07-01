import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const savedTheme = localStorage.getItem('devdocs_theme')
const initialTheme = savedTheme === 'dark' ? 'dark' : 'light'

document.documentElement.setAttribute('data-theme', initialTheme)

if (!savedTheme) {
  localStorage.setItem('devdocs_theme', 'light')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
