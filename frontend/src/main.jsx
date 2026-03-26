import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test page to confirm build works
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🕯️ Luxvira Scents</h1>
      <p>Website is loading successfully! 🎉</p>
      <p><i>Next: We'll add your product pages step by step.</i></p>
    </div>
  )
}

// Render the app to the <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
