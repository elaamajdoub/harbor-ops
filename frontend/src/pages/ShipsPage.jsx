import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Ship } from 'lucide-react'
import api from '../api/client'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { format } from 'date-fns'

const EMPTY = {
  name: '', imo_number: '', flag: '', type: 'Container Ship',
  gross_tonnage: '', status: 'expected', berth: '',
  eta: '', etd: '', captain_name: '', agent_name: ''
}

function ShipModal({ ship, onClose, onSave }) {
  const [form, setForm] = useState(ship || EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, gross_tonnage: form.gross_tonnage ? Number(form.gross_tonnage) : null }
      if (ship?.id) await api.put(`/ships/${ship.id}`, payload)
      else await api.post('/ships/', payload)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="font-display text-2xl text-white tracking-wider mb-6">
          {ship?.id ? 'EDIT SHIP' : 'REGISTER NEW SHIP'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label>Ship Name</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="MSC Adriana" /></div>
          <div><label>IMO Number</label><input value={form.imo_number} onChange={e => set('imo_number', e.target.value)} placeholder="IMO9234567" /></div>
          <div><label>Flag</label><input value={form.flag} onChange={e => set('flag', e.target.value)} placeholder="Panama" /></div>
          <div>
            <label>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              <option>Container Ship</option><option>Bulk Carrier</option><option>Tanker</option><option>Ro-Ro</option><option>General Cargo</option>
            </select>
          </div>
          <div><label>Gross Tonnage</label><input type="number" value={form.gross_tonnage} onChange={e => set('gross_tonnage', e.target.value)} placeholder="85000" /></div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="expected">Expected</option><option value="arrived">Arrived</option>
              <option value="docked">Docked</option><option value="departed">Departed</option>
            </select>
          </div>
          <div><label>Berth</label><input value={form.berth} onChange={e => set('berth', e.target.value)} placeholder="B-04" /></div>
          <div><label>ETA</label><input type="datetime-local" value={form.eta ? form.eta.slice(0,16) : ''} onChange={e => set('eta', e.target.value)} /></div>
          <div><label>ETD</label><input type="datetime-local" value={form.etd ? form.etd.slice(0,16) : ''} onChange={e => set('etd', e.target.value)} /></div>
          <div><label>Captain</label><input value={form.captain_name} onChange={e => set('captain_name', e.target.value)} placeholder="Capt. James Rivera" /></div>
          <div><label>Agent</label><input value={form.agent_name} onChange={e => set('agent_name', e.target.value)} placeholder="Mediterranean Shipping Co." /></div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Ship'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShipsPage() {
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | ship obj

  const load = () => api.get('/ships/').then(r => setShips(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this ship record?')) return
    await api.delete(`/ships/${id}`)
    load()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="SHIP MANAGEMENT"
        subtitle="Arrivals, departures and vessel registry"
        action={
          <button className="btn-primary" onClick={() => setModal('create')}>
            <Plus size={15} /> Register Ship
          </button>
        }
      />

      <div className="harbor-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-600 font-mono text-sm">Loading vessels...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vessel Name</th>
                <th>IMO</th>
                <th>Type</th>
                <th>Status</th>
                <th>Berth</th>
                <th>ETA/ETD</th>
                <th>Captain</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ships.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Ship size={14} className="text-harbor-accent flex-shrink-0" />
                      <span className="font-medium text-slate-200">{s.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-slate-400">{s.imo_number}</td>
                  <td className="text-slate-400 text-xs">{s.type}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="font-mono text-xs text-slate-300">{s.berth || '—'}</td>
                  <td className="text-xs text-slate-400">
                    {s.eta ? format(new Date(s.eta), 'dd MMM HH:mm') : '—'}
                  </td>
                  <td className="text-xs text-slate-400">{s.captain_name || '—'}</td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button className="btn-ghost py-1 px-2 text-xs" onClick={() => setModal(s)}>
                        <Pencil size={12} />
                      </button>
                      <button className="btn-danger py-1 px-2 text-xs" onClick={() => handleDelete(s.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ships.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-slate-600">No ships registered</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <ShipModal
          ship={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
