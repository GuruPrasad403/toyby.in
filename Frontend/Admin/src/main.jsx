import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
localStorage.setItem("jwtToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTczMTE3NTk1OX0.bhaHTB96SUPmPOAPJBpG-3OVulkIRmjSBmsKyLTY4Fg")
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
