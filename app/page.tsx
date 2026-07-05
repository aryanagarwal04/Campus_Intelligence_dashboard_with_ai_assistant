import QuickCards from '@/components/QuickCards';
import ChatInterface from '@/components/ChatInterface';

export const metadata = {
  title: 'Dashboard — CampusIQ',
  description: 'Your AI-powered campus control center',
};

export default function DashboardPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">
              <span>⚡</span>
              Campus Dashboard
            </h1>
            <p className="page-subtitle">
              Your unified campus intelligence hub — ask anything, get instant answers.
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            <span style={{ color: 'var(--success)', fontSize: '10px' }}>●</span>
            MCP Architecture Active
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Quick Overview
        </h2>
        <QuickCards />
      </div>

      {/* AI Chat */}
      <div>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          AI Assistant
        </h2>
        <ChatInterface />
      </div>

      {/* Architecture Info */}
      <div style={{
        marginTop: '24px',
        padding: '16px 20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex', gap: '20px', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Architecture: </span>
          Next.js 14 → Gemini AI Orchestrator → MCP Servers
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Servers: </span>
          Library :3001 · Cafeteria :3002 · Events :3003 · Academics :3004
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Model: </span>
          gemini-1.5-pro with function calling
        </div>
      </div>
    </div>
  );
}
