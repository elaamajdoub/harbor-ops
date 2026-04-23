import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Radio } from 'lucide-react'
import api from '../api/client'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { format } from 'date-fns'

const EMPTY = {
  ship_id: '', type: 'arrival_notice', subject: '', body: '',
  authority: '', status: 'sent', priority: 'normal'
}

const TYPE_LABELS = {
  arrival_notice: 'Arrival Notice',
  departure_clearance: 'Departure Clearance',
  customs_request: 'Customs Request',
  inspection: 'Inspection',
  alert: 'Alert'
}

const PRIORITY_COLORS = {
  low: '#64748b', normal: '#00d4ff', high: '#ffa502', urgent: '#ff4757'
}

function CommModal({ comm, ships, onClose, onSave }) {
  const [form, setForm] = useState(comm || EMPTY)
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, ship_id: form.ship_id || null }
      if (comm?.id) await api.put(`/communications/${comm.id}`, payload)
      else await api.post('/communications/', payload)
      onSave()
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="font-display text-2xl text-white tracking-wider mb-6">
          {comm?.id ? 'EDIT COMMUNICATION' : 'NEW COMMUNICATION'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low">Low</option><option value="normal">Normal</option>
              <option value="high">High</option><option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label>Related Ship</label>
            <select value={form.ship_id || ''} onChange={e => set('ship_id', e.target.value)}>
              <option value="">— None —</option>
              {ships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="sent">Sent</option><option value="received">Received</option>
              <option value="acknowledged">Acknowledged</option><option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="col-span-2"><label>Authority / Recipient</label><input value={form.authority} onChange={e => set('authority', e.target.value)} placeholder="Port Authority Tunis" /></div>
          <div className="col-span-2"><label>Subject</label><input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Communication subject..." /></div>
          <div className="col-span-2"><label>Message Body</label><textarea value={form.body} onChange={e => set('body', e.target.value)} rows={4} placeholder="Message content..." /></div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Sending...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

export default function CommunicationsPage() {
  const [comms, setComms] = useState([])
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => Promise.all([
    api.get('/communications/').then(r => setComms(r.data)),
    api.get('/ships/').then(r => setShips(r.data))
  ]).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this communication?')) return
    await api.delete(`/communications/${id}`)
    load()
  }

  const getShipName = (id) => ships.find(s => s.id === id)?.name || '—'

  return (
    <div className="p-8">
      <PageHeader
        title="PORT COMMUNICATIONS"
        subtitle="Messages and alerts with port authorities"
        action={<button className="btn-primary" onClick={() => setModal('create')}><Plus size={15} /> New Message</button>}
      />
      <div className="space-y-3">
        {loading && <div className="p-8 text-center text-slate-600 font-mono text-sm">Loading...</div>}
        {!loading && comms.length === 0 && (
          <div className="harbor-card p-8 text-center text-slate-600">No communications</div>
        )}
        {comms.map(c => (
          <div key={c.id} className="harbor-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${PRIORITY_COLORS[c.priority]}18`, border: `1px solid ${PRIORITY_COLORS[c.priority]}33` }}>
                  <Radio size={14} style={{ color: PRIORITY_COLORS[c.priority] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-slate-200 text-sm">{c.subject}</span>
                    <StatusBadge status={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{c.body}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
                    <span>{TYPE_LABELS[c.type] || c.type}</span>
                    {c.authority && <span>→ {c.authority}</span>}
                    {c.ship_id && <span>🚢 {getShipName(c.ship_id)}</span>}
                    {c.created_at && <span>{format(new Date(c.created_at), 'dd MMM yyyy HH:mm')}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="btn-ghost py-1 px-2 text-xs" onClick={() => setModal(c)}><Pencil size={12} /></button>
                <button className="btn-danger py-1 px-2 text-xs" onClick={() => handleDelete(c.id)}><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <CommModal
          comm={modal === 'create' ? null : modal}
          ships={ships}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
