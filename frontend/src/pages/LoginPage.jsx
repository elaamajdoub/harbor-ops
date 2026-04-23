import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Anchor, Lock, User, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Try admin / admin123')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-harbor-900 grid-lines flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-harbor-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-harbor-accent/10 border border-harbor-accent/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_#00d4ff15]">
            <Anchor size={28} className="text-harbor-accent" />
          </div>
          <h1 className="font-display text-4xl text-white tracking-widest mb-2">HARBOR OPS</h1>
          <p className="text-slate-500 text-sm font-mono">PORT MANAGEMENT SYSTEM v1.0</p>
        </div>

        {/* Card */}
        <div className="harbor-card-accent p-8">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">Operator Access</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>
            <div>
              <label>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-harbor-danger text-sm bg-harbor-danger/10 border border-harbor-danger/20 rounded-lg px-3 py-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 py-3"
              style={{ fontSize: '15px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs font-mono mt-6">
            Default: admin / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
