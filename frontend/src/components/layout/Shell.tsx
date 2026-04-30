import type { AuthUser } from '../../store/auth'

type ShellProps = {
  user: AuthUser | null
  activeView: string
  onViewChange: (view: string) => void
  onLogout: () => void
  children: React.ReactNode
}

const primaryNav = [
  ['market', 'Market'],
  ['orders', 'Orders'],
  ['tracking', 'Tracking'],
  ['wallet', 'Wallet'],
  ['procurement', 'Procurement'],
  ['support', 'Support'],
] as const

const staffNav = [
  ['vendor', 'Vendor'],
  ['admin', 'Operations'],
] as const

export function Shell({ user, activeView, onViewChange, onLogout, children }: ShellProps) {
  const navItems = user ? [...primaryNav, ...staffNav] : primaryNav

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">E</span>
          <div>
            <strong>Elvekas</strong>
            <small>Commerce</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map(([key, label]) => (
            <button
              key={key}
              className={activeView === key ? 'nav-item active' : 'nav-item'}
              type="button"
              onClick={() => onViewChange(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Gembu local commerce</p>
            <h1>{activeViewTitle(activeView)}</h1>
          </div>
          {user ? (
            <div className="account-box">
              <span>{user.first_name || user.phone}</span>
              <small>{user.role}</small>
              <button type="button" className="ghost-button" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <span className="auth-pill">Guest</span>
          )}
        </header>

        {children}
      </main>
    </div>
  )
}

function activeViewTitle(view: string): string {
  const labels: Record<string, string> = {
    market: 'Market',
    wallet: 'Wallet',
    orders: 'Orders',
    tracking: 'Tracking',
    procurement: 'Procurement',
    support: 'Support',
    vendor: 'Vendor workspace',
    admin: 'Operations',
  }

  return labels[view] || 'Dashboard'
}
