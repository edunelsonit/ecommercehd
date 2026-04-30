import { useState } from 'react'
import './App.css'
import { Shell } from './components/layout/Shell'
import { AdminPage } from './pages/admin/AdminPage'
import { AuthPanel } from './pages/AuthPanel'
import { MarketPage } from './pages/MarketPage'
import { OrdersPage, type Order } from './pages/OrdersPage'
import { ProcurementPage } from './pages/ProcurementPage'
import { SupportPage } from './pages/SupportPage'
import { TrackingPage } from './pages/TrackingPage'
import { VendorPage } from './pages/vendor/VendorPage'
import { WalletPage } from './pages/WalletPage'
import { clearAuth, loadAuth, saveAuth, type AuthState } from './store/auth'

function App() {
  const [auth, setAuth] = useState<AuthState | null>(() => loadAuth())
  const [activeView, setActiveView] = useState('market')
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null)

  function handleAuthenticated(nextAuth: AuthState) {
    saveAuth(nextAuth)
    setAuth(nextAuth)
  }

  function handleLogout() {
    clearAuth()
    setAuth(null)
    setActiveView('market')
  }

  return (
    <Shell
      user={auth?.user || null}
      activeView={activeView}
      onViewChange={setActiveView}
      onLogout={handleLogout}
    >
      {!auth && <AuthPanel onAuthenticated={handleAuthenticated} />}
      {activeView === 'market' && <MarketPage auth={auth} />}
      {activeView === 'orders' && (
        <OrdersPage
          auth={auth}
          onTrackOrder={(order) => {
            setTrackingOrder(order)
            setActiveView('tracking')
          }}
        />
      )}
      {activeView === 'tracking' && (
        <TrackingPage order={trackingOrder} onOpenOrders={() => setActiveView('orders')} />
      )}
      {activeView === 'wallet' && <WalletPage auth={auth} />}
      {activeView === 'procurement' && <ProcurementPage auth={auth} />}
      {activeView === 'support' && <SupportPage auth={auth} />}
      {activeView === 'vendor' && <VendorPage auth={auth} />}
      {activeView === 'admin' && <AdminPage auth={auth} />}
    </Shell>
  )
}

export default App
