import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import { ReservationProvider } from './context/ReservationContext'
import { OrderProvider } from './context/OrderContext'
import { UserAuthProvider } from './context/UserAuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ReservationProvider>
          <CartProvider>
            <OrderProvider>
              <UserAuthProvider>
                <App />
              </UserAuthProvider>
            </OrderProvider>
          </CartProvider>
        </ReservationProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
