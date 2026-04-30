import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if (typeof window !== 'undefined' && window.self !== window.top) {
  import('@sanity/visual-editing').then(({ enableVisualEditing }) => {
    enableVisualEditing();
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
