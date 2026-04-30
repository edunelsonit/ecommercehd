import { useState } from 'react'
import { Shell } from '../components/layout/Shell'
import { AdminPage } from './admin/AdminPage'
import { AuthPanel } from './AuthPanel'
import { MarketPage } from './MarketPage'
import { OrdersPage, type Order } from './OrdersPage'
import { ProcurementPage } from './ProcurementPage'
import { SupportPage } from './SupportPage'
import { TrackingPage } from './TrackingPage'
import { VendorPage } from './vendor/VendorPage'
import { WalletPage } from './WalletPage'
import { clearAuth, loadAuth, saveAuth, type AuthState } from '../store/auth'


const Dashboard = () => {


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
      {activeView === 'vendor' && <VendorPage auth={auth} onAuthChange={setAuth} />}
      {activeView === 'admin' && <AdminPage auth={auth} />}
    </Shell>
  )
}

export default Dashboard