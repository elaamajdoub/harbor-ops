import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react'
import api from '../api/client'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const EMPTY = { name: '', type: 'crane', status: 'available', location: '', operator_name: '', capacity_tons: '', notes: '' }

const EQUIPMENT_ICONS = { crane: '🏗️', reach_stacker: '🚜', forklift: '🔱', tractor: '🚛' }

function EquipmentModal({ equipment, ships, onClose, onSave }) {
  const [form, setForm] = useState(equipment || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, capacity_tons: form.capacity_tons ? Number(form.capacity_tons) : null, assigned_ship_id: form.assigned_ship_id || null }
      if (equipment?.id) await api.put(`/equipment/${equipment.id}`, payload)
      else await api.post('/equipment/', payload)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="font-display text-2xl text-white tracking-wider mb-6">
          {equipment?.id ? 'EDIT EQUIPMENT' : 'ADD EQUIPMENT'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label>Name</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Crane Alpha" /></div>
          <div>
            <label>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="crane">Crane</option>
              <option value="reach_stacker">Reach Stacker</option>
              <option value="forklift">Forklift</option>
              <option value="tractor">Terminal Tractor</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div><label>Capacity (tons)</label><input type="number" value={form.capacity_tons} onChange={e => set('capacity_tons', e.target.value)} placeholder="80" /></div>
          <div><label>Current Location</label><input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Berth B-04" /></div>
          <div><label>Operator</label><input value={form.operator_name} onChange={e => set('operator_name', e.target.value)} placeholder="Ahmed Salah" /></div>
          <div className="col-span-2">
            <label>Assigned Ship</label>
            <select value={form.assigned_ship_id || ''} onChange={e => set('assigned_ship_id', e.target.value)}>
              <option value="">— None —</option>
              {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-span-2"><label>Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} /></div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([])
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => Promise.all([
    api.get('/equipment/').then(r => setEquipment(r.data)),
    api.get('/ships/').then(r => setShips(r.data))
  ]).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this equipment?')) return
    await api.delete(`/equipment/${id}`)
    load()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="EQUIPMENT & CRANES"
        subtitle="Coordination of cranes and handling machinery"
        action={<button className="btn-primary" onClick={() => setModal('create')}><Plus size={15} /> Add Equipment</button>}
      />
      <div className="harbor-card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-600 font-mono text-sm">Loading...</div> : (
          <table>
            <thead><tr>
              <th>Equipment</th><th>Type</th><th>Status</th><th>Location</th>
              <th>Operator</th><th>Capacity</th><th></th>
            </tr></thead>
            <tbody>
              {equipment.map(e => (
                <tr key={e.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span>{EQUIPMENT_ICONS[e.type] || '⚙️'}</span>
                      <span className="font-medium text-slate-200">{e.name}</span>
                    </div>
                  </td>
                  <td className="text-xs text-slate-400 capitalize">{e.type?.replace(/_/g, ' ')}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td className="text-xs text-slate-400">{e.location || '—'}</td>
                  <td className="text-xs text-slate-400">{e.operator_name || '—'}</td>
                  <td className="font-mono text-xs text-slate-300">{e.capacity_tons ? `${e.capacity_tons}t` : '—'}</td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button className="btn-ghost py-1 px-2 text-xs" onClick={() => setModal(e)}><Pencil size={12} /></button>
                      <button className="btn-danger py-1 px-2 text-xs" onClick={() => handleDelete(e.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {equipment.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-slate-600">No equipment registered</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <EquipmentModal
          equipment={modal === 'create' ? null : modal}
          ships={ships}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
