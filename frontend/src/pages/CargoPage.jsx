import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package, CheckCircle, XCircle } from 'lucide-react'
import api from '../api/client'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const EMPTY = {
  tracking_number: '', ship_id: '', container_id: '', description: '',
  shipper: '', consignee: '', origin: '', destination: '',
  weight_kg: '', status: 'in_transit', customs_cleared: false
}

function CargoModal({ cargo, ships, containers, onClose, onSave }) {
  const [form, setForm] = useState(cargo || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        ship_id: form.ship_id || null,
        container_id: form.container_id || null
      }
      if (cargo?.id) await api.put(`/cargo/${cargo.id}`, payload)
      else await api.post('/cargo/', payload)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="font-display text-2xl text-white tracking-wider mb-6">
          {cargo?.id ? 'EDIT CARGO' : 'NEW CARGO ENTRY'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label>Tracking Number</label><input value={form.tracking_number} onChange={e => set('tracking_number', e.target.value)} placeholder="TRK-2024-00123" /></div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="in_transit">In Transit</option>
              <option value="at_port">At Port</option>
              <option value="customs_hold">Customs Hold</option>
              <option value="released">Released</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label>Ship</label>
            <select value={form.ship_id || ''} onChange={e => set('ship_id', e.target.value)}>
              <option value="">— None —</option>
              {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Container</label>
            <select value={form.container_id || ''} onChange={e => set('container_id', e.target.value)}>
              <option value="">— None —</option>
              {containers.map(c => <option key={c.id} value={c.id}>{c.container_number}</option>)}
            </select>
          </div>
          <div><label>Shipper</label><input value={form.shipper} onChange={e => set('shipper', e.target.value)} placeholder="Samsung Korea" /></div>
          <div><label>Consignee</label><input value={form.consignee} onChange={e => set('consignee', e.target.value)} placeholder="Electroplanet Tunisia" /></div>
          <div><label>Origin</label><input value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="Busan, South Korea" /></div>
          <div><label>Destination</label><input value={form.destination} onChange={e => set('destination', e.target.value)} placeholder="Tunis" /></div>
          <div><label>Weight (kg)</label><input type="number" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} /></div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" id="customs" checked={form.customs_cleared} onChange={e => set('customs_cleared', e.target.checked)} style={{ width: 'auto' }} />
            <label htmlFor="customs" style={{ marginBottom: 0, textTransform: 'none', fontSize: '13px', color: '#2ed573' }}>Customs Cleared</label>
          </div>
          <div className="col-span-2"><label>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} /></div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

export default function CargoPage() {
  const [cargo, setCargo] = useState([])
  const [ships, setShips] = useState([])
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => Promise.all([
    api.get('/cargo/').then(r => setCargo(r.data)),
    api.get('/ships/').then(r => setShips(r.data)),
    api.get('/containers/').then(r => setContainers(r.data)),
  ]).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this cargo entry?')) return
    await api.delete(`/cargo/${id}`)
    load()
  }

  return (
    <div className="p-8">
      <PageHeader
        title="CARGO TRACKING"
        subtitle="Merchandise tracking and customs status"
        action={<button className="btn-primary" onClick={() => setModal('create')}><Plus size={15} /> New Entry</button>}
      />
      <div className="harbor-card overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-600 font-mono text-sm">Loading cargo...</div> : (
          <table>
            <thead><tr>
              <th>Tracking #</th><th>Status</th><th>Shipper</th><th>Consignee</th>
              <th>Origin → Dest.</th><th>Weight</th><th>Customs</th><th></th>
            </tr></thead>
            <tbody>
              {cargo.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Package size={13} className="text-harbor-accent flex-shrink-0" />
                      <span className="font-mono text-sm text-slate-200">{c.tracking_number}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="text-xs text-slate-400">{c.shipper || '—'}</td>
                  <td className="text-xs text-slate-400">{c.consignee || '—'}</td>
                  <td className="text-xs text-slate-400">{c.origin && c.destination ? `${c.origin} → ${c.destination}` : '—'}</td>
                  <td className="font-mono text-xs text-slate-300">{c.weight_kg ? `${c.weight_kg.toLocaleString()} kg` : '—'}</td>
                  <td>
                    {c.customs_cleared
                      ? <span className="flex items-center gap-1 text-harbor-success text-xs"><CheckCircle size={12} /> Cleared</span>
                      : <span className="flex items-center gap-1 text-harbor-warn text-xs"><XCircle size={12} /> Pending</span>}
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button className="btn-ghost py-1 px-2 text-xs" onClick={() => setModal(c)}><Pencil size={12} /></button>
                      <button className="btn-danger py-1 px-2 text-xs" onClick={() => handleDelete(c.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {cargo.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-slate-600">No cargo entries</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <CargoModal
          cargo={modal === 'create' ? null : modal}
          ships={ships}
          containers={containers}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
