'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⚡' },
  { href: '/library', label: 'Library', icon: '📚', service: 'library' },
  { href: '/cafeteria', label: 'Cafeteria', icon: '🍽️', service: 'cafeteria' },
  { href: '/events', label: 'Events', icon: '📅', service: 'events' },
  { href: '/academics', label: 'Academics', icon: '🎓', service: 'academics' },
  { href: '/status', label: 'System Status', icon: '🔧' },
  { href: '/admin', label: 'Admin Panel', icon: '⚙️' },
];

interface ServiceStatus {
  service: string;
  status: 'online' | 'offline' | 'checking';
}

export default function Sidebar() {
  const pathname = usePathname();
  const [statuses, setStatuses] = useState<Record<string, ServiceStatus['status']>>({
    library: 'checking', cafeteria: 'checking', events: 'checking', academics: 'checking',
  });
  
  const [user, setUser] = useState<{ email: string, role: string, branch: string } | null>(null);

  useEffect(() => {
    // Check Auth State
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkAuth();
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/health-check');
        if (res.ok) {
          const data = await res.json();
          const newStatuses: Record<string, ServiceStatus['status']> = {};
          data.services.forEach((s: { service: string; status: string }) => {
            newStatuses[s.service] = s.status as ServiceStatus['status'];
          });
          setStatuses(newStatuses);
        }
      } catch {
        // All offline if fetch fails
        setStatuses({ library: 'offline', cafeteria: 'offline', events: 'offline', academics: 'offline' });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0
          }}>
            🏛️
          </div>
          <div>
            <div className="sidebar-logo-text">CampusIQ</div>
            <div className="sidebar-logo-sub">Unified Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>

        {navItems.map((item) => {
          if (item.href === '/admin' && user?.role !== 'admin') return null;

          const isActive = pathname === item.href;
          const serviceStatus = item.service ? statuses[item.service] : null;

          return (
            <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-link-icon">{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {serviceStatus && (
                <span
                  className={`status-dot ${serviceStatus}`}
                  title={`${item.label}: ${serviceStatus}`}
                />
              )}
            </Link>
          );
        })}

        {/* MCP Status Summary */}
        <div style={{ marginTop: '20px' }}>
          <div className="nav-section-label">MCP Servers</div>
          <div style={{
            padding: '12px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}>
            {['library', 'cafeteria', 'events', 'academics'].map((svc) => (
              <div key={svc} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 0',
                fontSize: '12px', color: 'var(--text-muted)',
                borderBottom: svc !== 'academics' ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ textTransform: 'capitalize' }}>{svc}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className={`status-dot ${statuses[svc]}`} />
                  <span style={{
                    fontSize: '10px',
                    color: statuses[svc] === 'online' ? 'var(--success)' : statuses[svc] === 'offline' ? 'var(--error)' : 'var(--warning)'
                  }}>
                    {statuses[svc] === 'checking' ? '...' : statuses[svc]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer / Auth */}
      <div className="sidebar-footer">
        {user ? (
          <div style={{ fontSize: '11px', color: 'var(--text-faint)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{user.email.split('@')[0]}</div>
            <div style={{ color: 'var(--accent-primary)', marginBottom: '6px' }}>{user.branch}</div>
            <button 
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}
              style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border)', width: '100%' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '8px', background: 'var(--bg-elevated)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            Sign In to CampusIQ
          </Link>
        )}
      </div>
    </aside>
  );
}
