import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { ShopDataProvider } from './context/ShopDataContext'
import { CurrencyProvider } from './context/CurrencyContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <ShopDataProvider>
            <App />
          </ShopDataProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
)
