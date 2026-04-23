import { useEffect, useState } from 'react'
import { Ship, BoxSelect, Wrench, Package, Radio, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../api/client'
import PageHeader from '../components/PageHeader'

const StatCard = ({ label, value, sub, icon: Icon, color }) => (
  <div className="harbor-card p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <div className="text-2xl font-display text-white tracking-wider">{value ?? '—'}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color }}>{sub}</div>}
    </div>
  </div>
)

const COLORS = ['#00d4ff', '#2ed573', '#f4a61d', '#64748b']

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-8 flex items-center gap-3 text-harbor-accent font-mono text-sm">
      <span className="pulse-dot w-2 h-2 rounded-full bg-harbor-accent inline-block" />
      Loading operational data...
    </div>
  )

  const shipPieData = [
    { name: 'Docked', value: stats?.ships_docked || 0 },
    { name: 'Expected', value: stats?.ships_expected || 0 },
    { name: 'Departed', value: stats?.ships_departed || 0 },
    { name: 'Other', value: Math.max(0, (stats?.ships_total || 0) - (stats?.ships_docked || 0) - (stats?.ships_expected || 0) - (stats?.ships_departed || 0)) },
  ].filter(d => d.value > 0)

  const equipmentData = [
    { name: 'Available', value: stats?.equipment_available || 0 },
    { name: 'In Use', value: stats?.equipment_in_use || 0 },
  ]

  return (
    <div className="p-8">
      <PageHeader
        title="OPERATIONS DASHBOARD"
        subtitle="Real-time port activity overview"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Ships in System" value={stats?.ships_total} sub={`${stats?.ships_docked} docked`} icon={Ship} color="#00d4ff" />
        <StatCard label="Ships Expected" value={stats?.ships_expected} sub="Awaiting arrival" icon={Ship} color="#f4a61d" />
        <StatCard label="Containers in Yard" value={stats?.containers_in_yard} sub={`of ${stats?.containers_total} total`} icon={BoxSelect} color="#2ed573" />
        <StatCard label="Equipment Available" value={stats?.equipment_available} sub={`${stats?.equipment_in_use} in use`} icon={Wrench} color="#a78bfa" />
        <StatCard label="Pending Customs" value={stats?.cargo_pending_customs} sub="Clearance required" icon={Package} color="#ffa502" />
        <StatCard label="Urgent Comms" value={stats?.communications_urgent} sub="Require attention" icon={Radio} color="#ff4757" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ship Status Pie */}
        <div className="harbor-card p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Ship size={14} className="text-harbor-accent" />
            Ship Status Distribution
          </h3>
          {shipPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={shipPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                  {shipPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#071428', border: '1px solid #0e2a52', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-600 text-sm text-center py-10">No ship data</p>}
          <div className="flex flex-wrap gap-3 mt-2">
            {shipPieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name}: <span className="text-white font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Bar */}
        <div className="harbor-card p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wrench size={14} className="text-harbor-accent" />
            Equipment Status
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={equipmentData} barSize={40}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#071428', border: '1px solid #0e2a52', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#00d4ff" radius={[6, 6, 0, 0]}>
                {equipmentData.map((_, i) => <Cell key={i} fill={i === 0 ? '#2ed573' : '#00d4ff'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
