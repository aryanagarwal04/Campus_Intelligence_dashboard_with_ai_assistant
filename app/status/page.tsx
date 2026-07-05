'use client';

import { useState, useEffect, useCallback } from 'react';

const REFRESH_INTERVAL = 30;

interface ServiceStatus {
  service: string;
  label: string;
  icon: string;
  status: 'online' | 'offline';
  responseTime: number;
  lastChecked: string;
  error?: string;
}

interface HealthData {
  services: ServiceStatus[];
  allOperational: boolean;
  checkedAt: string;
}

function StatusCard({ svc }: { svc: ServiceStatus }) {
  const isOnline = svc.status === 'online';

  return (
    <div className="status-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
          background: isOnline ? 'var(--success-bg)' : 'var(--error-bg)',
          border: `1px solid ${isOnline ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', flexShrink: 0,
        }}>
          {svc.icon}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{svc.label}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>MCP Server</div>
          {svc.error && (
            <div style={{ fontSize: '11px', color: 'var(--error)', marginTop: '2px' }}>{svc.error}</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Response Time */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isOnline ? 'var(--text-primary)' : 'var(--text-faint)' }}>
            {isOnline ? `${svc.responseTime}ms` : '—'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>response time</div>
        </div>

        {/* Status Badge */}
        <span className={`badge ${isOnline ? 'badge-success' : 'badge-error'}`}>
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
          {isOnline ? 'Operational' : 'Offline'}
        </span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health-check');
      const json = await res.json();
      setData(json);
      setLastRefreshTime(new Date());
      setCountdown(REFRESH_INTERVAL);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const refreshInterval = setInterval(fetchHealth, REFRESH_INTERVAL * 1000);
    return () => clearInterval(refreshInterval);
  }, [fetchHealth]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : REFRESH_INTERVAL));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progressPercent = ((REFRESH_INTERVAL - countdown) / REFRESH_INTERVAL) * 100;
  const allOk = data?.allOperational;

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">🔧 System Status</h1>
            <p className="page-subtitle">Live health monitoring for all Campus MCP servers.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Countdown Ring */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `conic-gradient(var(--accent-primary) ${progressPercent}%, var(--bg-tertiary) 0%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '3px',
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 600,
                }}>
                  {countdown}s
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>next refresh</span>
            </div>

            <button
              className="btn btn-ghost"
              onClick={fetchHealth}
              disabled={loading}
              id="refresh-now-btn"
            >
              {loading ? (
                <span className="spin">⟳</span>
              ) : '⟳'} Refresh Now
            </button>
          </div>
        </div>
      </div>

      {/* Overall Status Banner */}
      {data && (
        <div style={{
          padding: '16px 20px', marginBottom: '24px',
          background: allOk ? 'var(--success-bg)' : 'var(--error-bg)',
          border: `1px solid ${allOk ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          borderRadius: 'var(--radius-xl)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '28px' }}>{allOk ? '✅' : '⚠️'}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: allOk ? 'var(--success)' : 'var(--error)' }}>
              {allOk ? 'All Systems Operational' : 'Some Services Offline'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Last checked: {lastRefreshTime?.toLocaleTimeString('en-IN') || '—'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <span className="badge badge-success">{data.services.filter(s => s.status === 'online').length} online</span>
            {data.services.filter(s => s.status === 'offline').length > 0 && (
              <span className="badge badge-error">{data.services.filter(s => s.status === 'offline').length} offline</span>
            )}
          </div>
        </div>
      )}

      {/* Service Cards */}
      {loading && !data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.services.map(svc => (
            <StatusCard key={svc.service} svc={svc} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
          <div>Could not reach health check endpoint.</div>
          <button className="btn btn-primary" onClick={fetchHealth} style={{ marginTop: '16px' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Architecture Info */}
      <div style={{
        marginTop: '32px', padding: '18px 22px',
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          MCP Architecture
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { label: 'Library MCP', port: '3001', icon: '📚' },
            { label: 'Cafeteria MCP', port: '3002', icon: '🍽️' },
            { label: 'Events MCP', port: '3003', icon: '📅' },
            { label: 'Academics MCP', port: '3004', icon: '🎓' },
          ].map(svc => (
            <div key={svc.port} style={{
              padding: '10px 14px', background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>{svc.icon}</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{svc.label}</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>:localhost:{svc.port}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
