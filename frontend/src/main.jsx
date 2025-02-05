import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import "bootstrap/dist/css/bootstrap.css"
import 'font-awesome/css/font-awesome.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
