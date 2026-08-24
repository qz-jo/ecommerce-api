import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/responsive.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
