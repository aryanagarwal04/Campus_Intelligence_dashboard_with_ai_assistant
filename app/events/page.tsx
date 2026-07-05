'use client';

import { useState, useEffect } from 'react';

const FILTERS = ['upcoming', 'tech', 'cultural', 'sports', 'workshop', 'other'];

interface MongoEvent {
  _id: string;
  name: string;
  category: string;
  date: string;
  venue: string;
  organizer: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Tech: '#3B82F6',
  Cultural: '#A855F7',
  Sports: '#22C55E',
  Workshop: '#F59E0B',
  Other: '#64748B',
};

function EventCard({ event }: { event: MongoEvent }) {
  const color = CATEGORY_COLORS[event.category] || '#64748B';
  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="event-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <span className="badge" style={{
          background: color + '18', color, border: `1px solid ${color}30`,
          textTransform: 'capitalize',
        }}>
          {event.category}
        </span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginTop: '12px', marginBottom: '12px' }}>
        {event.name}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🕐</span> {formattedDate}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📍</span> {event.venue}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏢</span> {event.organizer}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [events, setEvents] = useState<MongoEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (filter: string) => {
    setLoading(true);
    try {
      const endpoint = filter === 'upcoming' 
        ? '/api/mcp/events' 
        : `/api/mcp/events?category=${encodeURIComponent(filter)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(activeFilter); }, [activeFilter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 className="page-title">📅 Campus Events</h1>
            <p className="page-subtitle">Fests, workshops, hackathons, and cultural events — all in one place.</p>
          </div>
          <span className="badge badge-info">{events.length} total events</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="overflow-x-auto pb-4 mb-4">
        <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`btn ${activeFilter.toLowerCase() === f.toLowerCase() ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setActiveFilter(f)}
              style={{ textTransform: 'capitalize' }}
            >
              {f === 'tech' && '💻 '}
              {f === 'cultural' && '🎭 '}
              {f === 'sports' && '⚽ '}
              {f === 'workshop' && '🔧 '}
              {f === 'upcoming' && '📅 '}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>No events found</div>
          <div style={{ color: 'var(--text-muted)' }}>Try a different filter or check back later.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
