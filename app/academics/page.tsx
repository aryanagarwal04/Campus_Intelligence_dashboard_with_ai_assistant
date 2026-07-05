'use client';

import { useState, useEffect } from 'react';

const TABS = [
  { key: 'Exam', label: 'Exams', icon: '📝' },
  { key: 'Holiday', label: 'Holidays', icon: '🏖️' },
  { key: 'Faculty', label: 'Faculty', icon: '👨‍🏫' },
];

interface MongoAcademic {
  _id: string;
  type: string;
  title: string;
  date?: string;
  details: string;
  department?: string;
}

function AcademicCard({ record }: { record: MongoAcademic }) {
  const formattedDate = record.date 
    ? new Date(record.date).toLocaleDateString('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      })
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{record.title}</h3>
        {record.department && (
          <span className="badge badge-info" style={{ fontSize: '10px' }}>{record.department}</span>
        )}
      </div>
      
      {formattedDate && (
        <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
          📅 {formattedDate}
        </div>
      )}
      
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '4px' }}>
        {record.details}
      </p>
    </div>
  );
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState('Exam');
  const [records, setRecords] = useState<MongoAcademic[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mcp/academics?type=${type}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      } else {
        setRecords([]);
      }
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(activeTab); }, [activeTab]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🎓 Academics</h1>
        <p className="page-subtitle">Exam schedules, holidays, and faculty information.</p>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto pb-4 mb-4">
        <div className="tab-list" style={{ minWidth: 'max-content' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
          <div style={{ color: 'var(--text-muted)' }}>No records found for this category.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {records.map(record => (
            <AcademicCard key={record._id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
