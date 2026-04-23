const statusStyles = {
  // Ships
  expected:   { bg: '#f4a61d22', color: '#f4a61d', dot: '#f4a61d' },
  arrived:    { bg: '#00d4ff22', color: '#00d4ff', dot: '#00d4ff' },
  docked:     { bg: '#2ed57322', color: '#2ed573', dot: '#2ed573' },
  departed:   { bg: '#64748b22', color: '#64748b', dot: '#64748b' },
  // Containers
  inbound:    { bg: '#f4a61d22', color: '#f4a61d', dot: '#f4a61d' },
  unloaded:   { bg: '#00d4ff22', color: '#00d4ff', dot: '#00d4ff' },
  in_yard:    { bg: '#2ed57322', color: '#2ed573', dot: '#2ed573' },
  outbound:   { bg: '#a78bfa22', color: '#a78bfa', dot: '#a78bfa' },
  // Equipment
  available:  { bg: '#2ed57322', color: '#2ed573', dot: '#2ed573' },
  in_use:     { bg: '#00d4ff22', color: '#00d4ff', dot: '#00d4ff' },
  maintenance:{ bg: '#ffa50222', color: '#ffa502', dot: '#ffa502' },
  offline:    { bg: '#ff475722', color: '#ff4757', dot: '#ff4757' },
  // Cargo
  in_transit: { bg: '#00d4ff22', color: '#00d4ff', dot: '#00d4ff' },
  at_port:    { bg: '#f4a61d22', color: '#f4a61d', dot: '#f4a61d' },
  customs_hold:{ bg: '#ff475722', color: '#ff4757', dot: '#ff4757' },
  released:   { bg: '#2ed57322', color: '#2ed573', dot: '#2ed573' },
  delivered:  { bg: '#64748b22', color: '#64748b', dot: '#64748b' },
  // Comms
  sent:       { bg: '#00d4ff22', color: '#00d4ff', dot: '#00d4ff' },
  received:   { bg: '#a78bfa22', color: '#a78bfa', dot: '#a78bfa' },
  acknowledged:{ bg: '#f4a61d22', color: '#f4a61d', dot: '#f4a61d' },
  resolved:   { bg: '#2ed57322', color: '#2ed573', dot: '#2ed573' },
  // Priority
  low:        { bg: '#64748b22', color: '#64748b', dot: '#64748b' },
  normal:     { bg: '#00d4ff22', color: '#00d4ff', dot: '#00d4ff' },
  high:       { bg: '#ffa50222', color: '#ffa502', dot: '#ffa502' },
  urgent:     { bg: '#ff475722', color: '#ff4757', dot: '#ff4757' },
}

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || { bg: '#64748b22', color: '#94a3b8', dot: '#94a3b8' }
  return (
    <span className="status-pill" style={{ background: style.bg, color: style.color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: style.dot }} />
      {status?.replace(/_/g, ' ')}
    </span>
  )
}
