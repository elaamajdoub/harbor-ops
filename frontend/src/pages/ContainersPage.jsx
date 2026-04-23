import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, BoxSelect, AlertTriangle } from 'lucide-react'
import api from '../api/client'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const EMPTY = {
  container_number: '', ship_id: '', type: '20ft', status: 'inbound',
  cargo_type: '', weight_kg: '', owner: '', destination: '', position: '',
  is_hazardous: false, notes: ''
}

function ContainerModal({ container, ships, onClose, onSave }) {
  const [form, setForm] = useState(container || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, weight_kg: form.weight_kg ? Number(form.weight_kg) : null, ship_id: form.ship_id || null }
      if (container?.id) await api.put(`/containers/${container.id}`, payload)
      else await api.post('/containers/', payload)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="font-display text-2xl text-white tracking-wider mb-6">
          {container?.id ? 'EDIT CONTAINER' : 'ADD CONTAINER'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label>Container Number</label><input value={form.container_number} onChange={e => set('container_number', e.target.value)} placeholder="MSCU1234567" /></div>
          <div>
            <label>Associated Ship</label>
            <select value={form.ship_id || ''} onChange={e => set('ship_id', e.target.value)}>
              <option value="">— None —</option>
              {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Size</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="20ft">20ft</option><option value="40ft">40ft</option><option value="40ft-hc">40ft HC</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="inbound">Inbound</option><option value="unloaded">Unloaded</option>
              <option value="in_yard">In Yard</option><option value="outbound">Outbound</option><option value="departed">Departed</option>
            </select>
          </div>
          <div><label>Cargo Type</label><input value={form.cargo_type} onChange={e => set('cargo_type', e.target.value)} placeholder="Electronics" /></div>
          <div><label>Weight (kg)</label><input type="number" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} placeholder="18500" /></div>
          <div><label>Owner</label><input value={form.owner} onChange={e => set('owner', e.target.value)} placeholder="Samsung Corp" /></div>
          <div><label>Destination</label><input value={form.destination} onChange={e => set('destination', e.target.value)} placeholder="Tunis Centre" /></div>
          <div><label>Yard Position</label><input value={form.position} onChange={e => set('position', e.target.value)} placeholder="A-04-2" /></div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" id="haz" checked={form.is_hazardous} onChange={e => set('is_hazardous', e.target.checked)} style={{ width: 'auto' }} />
            <label htmlFor="haz" style={{ marginBottom: 0, textTransform: 'none', fontSize: '13px', color: '#ffa502' }}>Hazardous Cargo</label>
          </div>
          <div className="col-span-2"><label>Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Additional info..." /></div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

export default function ContainersPage() {
  const [containers, setContainers] = useState([])
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => Promise.all([
    api.get('/containers/').then(r => setContainers(r.data)),
    api.get('/ships/').then(r => setShips(r.data))
  ]).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this container?')) return
    await api.delete(`/containers/${id}`)
    load()
  }

  const getShipName = (id) => ships.find(s => s.id === id)?.name || '—'

  return (
    <div className="p-8">
      <PageHeader
        title="CONTAINER MANAGEMENT"
        subtitle="Track and manage port containers"
        action={<button className="btn-primary" onClick={() => setModal('create')}><Plus size={15} /> Add Container</button>}
      />
      <div className="harbor-card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-600 font-mono text-sm">Loading containers...</div> : (
          <table>
            <thead><tr>
              <th>Container #</th><th>Ship</th><th>Size</th><th>Status</th>
              <th>Cargo Type</th><th>Position</th><th>Owner</th><th></th>
            </tr></thead>
            <tbody>
              {containers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <BoxSelect size={13} className="text-harbor-accent flex-shrink-0" />
                      <span className="font-mono text-sm text-slate-200">{c.container_number}</span>
                      {c.is_hazardous && <AlertTriangle size={12} className="text-harbor-warn" title="Hazardous" />}
                    </div>
                  </td>
                  <td className="text-xs text-slate-400">{getShipName(c.ship_id)}</td>
                  <td className="font-mono text-xs text-slate-400">{c.type}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="text-xs text-slate-400">{c.cargo_type || '—'}</td>
                  <td className="font-mono text-xs text-slate-300">{c.position || '—'}</td>
                  <td className="text-xs text-slate-400">{c.owner || '—'}</td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button className="btn-ghost py-1 px-2 text-xs" onClick={() => setModal(c)}><Pencil size={12} /></button>
                      <button className="btn-danger py-1 px-2 text-xs" onClick={() => handleDelete(c.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {containers.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-slate-600">No containers</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <ContainerModal
          container={modal === 'create' ? null : modal}
          ships={ships}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
