import { Icon } from './Icon'

export function Topbar({ title, showBack = true, onBack, right }) {
  return (
    <header className="topbar">
      {showBack ? (
        <button className="back" onClick={onBack} aria-label="Kembali">
          <Icon name="back" size={22} />
          <span>{title}</span>
        </button>
      ) : (
        <span style={{ fontWeight: 700, fontSize: 18 }}>{title}</span>
      )}
      {right}
    </header>
  )
}

export function BottomNav() {
  const path = window.location.pathname
  const navs = [
    { to: '/map', label: 'Peta', icon: 'map' },
    { to: '/result', label: 'Hasil', icon: 'result' },
    { to: '/profile', label: 'Profil', icon: 'profile' }
  ]
  return (
    <nav className="bottomnav">
      {navs.map(n => (
        <a key={n.to} href={n.to} className={path.startsWith(n.to) ? 'active' : ''}>
          <Icon name={n.icon} size={22} />
          {n.label}
        </a>
      ))}
    </nav>
  )
}

export function Alert({ type = 'err', children }) {
  if (!children) return null
  return <div className={`alert alert-${type}`}>{children}</div>
}

export function Spinner({ label }) {
  return (
    <div className="center" style={{ flex: 1, gap: 12, padding: 40 }}>
      <div className="spinner" />
      {label && <p className="muted">{label}</p>}
    </div>
  )
}
