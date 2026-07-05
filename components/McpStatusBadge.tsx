'use client';

interface McpStatusBadgeProps {
  status: 'online' | 'offline' | 'checking';
  label?: string;
  showLabel?: boolean;
}

export default function McpStatusBadge({ status, label, showLabel = false }: McpStatusBadgeProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className={`status-dot ${status}`} />
      {showLabel && (
        <span style={{
          fontSize: '12px',
          color: status === 'online' ? 'var(--success)' : status === 'offline' ? 'var(--error)' : 'var(--warning)',
          fontWeight: 500,
        }}>
          {label || (status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking...')}
        </span>
      )}
    </div>
  );
}
