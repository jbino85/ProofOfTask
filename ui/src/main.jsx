// MirrorWitness AR 2025-11-04

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import ImmersivePage from './pages/ImmersivePage'
import DashboardPage from './pages/DashboardPage'
import TestPage from './pages/TestPage'
import './index.css'
import '@mysten/dapp-kit/dist/index.css'

const queryClient = new QueryClient()

const networks = {
  localnet: { url: getFullnodeUrl('localnet') },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="localnet">
        <WalletProvider autoConnect>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<TestPage />} />
              <Route path="/immersive" element={<ImmersivePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
