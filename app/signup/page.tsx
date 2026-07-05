'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.endsWith('.iitr.ac.in')) {
      setError('You must use a valid @*.iitr.ac.in college email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminPasscode })
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = data.user.role === 'admin' ? '/admin' : '/';
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundImage: 'radial-gradient(circle at top right, #dcfce7 0%, #f8fafc 40%), radial-gradient(circle at bottom left, #ccfbf1 0%, #f8fafc 40%)'
    }}>
      <div style={{
        width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', padding: '48px 40px',
        borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.5)', textAlign: 'center', position: 'relative',
        margin: '32px 0'
      }}>
        
        <div style={{ position: 'absolute', top: '-15px', right: '-15px', fontSize: '40px', opacity: 0.8, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>🌟</div>

        <div style={{
          width: '72px', height: '72px', margin: '0 auto 24px auto',
          background: 'linear-gradient(135deg, #10b981, #14b8a6)', borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.1 0-2 .9-2 2v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          Create Account
        </h2>
        <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 32px 0' }}>
          Join the CampusIQ network today
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2', color: '#ef4444', padding: '12px 16px', 
            borderRadius: '16px', fontSize: '14px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fee2e2', textAlign: 'left'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <input 
              type="email" required placeholder="College Email (.iitr.ac.in)"
              style={{
                width: '100%', padding: '16px 16px 16px 48px', backgroundColor: '#f8fafc', 
                border: '2px solid #e2e8f0', borderRadius: '100px', fontSize: '15px', color: '#0f172a',
                outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input 
              type={showPassword ? "text" : "password"} required placeholder="Password (Min. 8 chars)"
              style={{
                width: '100%', padding: '16px 48px 16px 48px', backgroundColor: '#f8fafc', 
                border: '2px solid #e2e8f0', borderRadius: '100px', fontSize: '15px', color: '#0f172a',
                outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              value={password} onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
            >
              {showPassword ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </div>
            <input 
              type={showPasscode ? "text" : "password"} placeholder="Admin Passcode (Optional)"
              style={{
                width: '100%', padding: '16px 48px 16px 48px', backgroundColor: '#f8fafc', 
                border: '2px solid #e2e8f0', borderRadius: '100px', fontSize: '15px', color: '#0f172a',
                outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              value={adminPasscode} onChange={e => setAdminPasscode(e.target.value)}
            />
            <button 
              type="button" onClick={() => setShowPasscode(!showPasscode)}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
            >
              {showPasscode ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>

          <button 
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', marginTop: '12px',
              background: 'linear-gradient(135deg, #10b981, #14b8a6)', color: '#ffffff',
              border: 'none', borderRadius: '100px', fontSize: '16px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
              boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(16, 185, 129, 0.5)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(16, 185, 129, 0.4)'; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 10px -5px rgba(16, 185, 129, 0.4)'; }}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '32px', fontSize: '15px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
