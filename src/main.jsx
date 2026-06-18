import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Keep every open copy on the latest version: check for a new deployment every
// minute, and when a new version takes over, reload the page automatically.
// (The first-install case is skipped so brand-new visitors don't get a reload.)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready
    .then((reg) => {
      setInterval(() => {
        reg.update().catch(() => {})
      }, 60 * 1000)
    })
    .catch(() => {})

  const hadController = !!navigator.serviceWorker.controller
  let reloaded = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return
    reloaded = true
    window.location.reload()
  })
}
