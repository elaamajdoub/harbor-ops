import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Ship, Package, Wrench,
  BoxSelect, Radio, LogOut, Anchor
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ships', icon: Ship, label: 'Ships' },
  { to: '/containers', icon: BoxSelect, label: 'Containers' },
  { to: '/equipment', icon: Wrench, label: 'Equipment' },
  { to: '/cargo', icon: Package, label: 'Cargo' },
  { to: '/communications', icon: Radio, label: 'Communications' },
]

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-harbor-600/50 bg-harbor-800 grid-lines flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-harbor-600/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-harbor-accent/10 border border-harbor-accent/30 flex items-center justify-center">
              <Anchor size={18} className="text-harbor-accent" />
            </div>
            <div>
              <div className="font-display text-xl text-white leading-none tracking-wider">HARBOR OPS</div>
              <div className="text-[10px] text-harbor-accent/60 font-mono mt-0.5">PORT MANAGEMENT SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-harbor-accent/10 text-harbor-accent border border-harbor-accent/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-harbor-700/50'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-harbor-600/50">
          <div className="flex items-center gap-2 mb-3 px-3">
            <div className="w-2 h-2 rounded-full bg-harbor-success pulse-dot" />
            <span className="text-xs text-slate-500 font-mono">SYSTEM ONLINE</span>
          </div>
          <button onClick={handleLogout} className="btn-ghost w-full justify-center text-xs">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-harbor-900 grid-lines">
        <Outlet />
      </main>
    </div>
  )
}
