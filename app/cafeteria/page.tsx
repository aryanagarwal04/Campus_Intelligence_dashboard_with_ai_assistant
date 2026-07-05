'use client';

import { useState, useEffect } from 'react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MongoMenuItem {
  _id: string;
  day: string;
  meal: string;
  items: string[];
  timing: string;
}

function MealSection({ meal, menuItems }: { meal: string; menuItems: MongoMenuItem[] }) {
  const mealData = menuItems.find(m => m.meal.toLowerCase() === meal.toLowerCase());
  
  if (!mealData) return (
    <div className="card" style={{ flex: 1, minWidth: '260px', opacity: 0.7 }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>{meal}</h3>
      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No menu available
      </div>
    </div>
  );

  return (
    <div className="card" style={{ flex: 1, minWidth: '260px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{mealData.meal}</h3>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-faint)' }}>{mealData.timing}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {mealData.items.map((item, idx) => (
          <div key={idx} style={{
            padding: '10px 12px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CafeteriaPage() {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [activeDay, setActiveDay] = useState(DAYS[todayIdx]);
  const [menuItems, setMenuItems] = useState<MongoMenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenu = async (day: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mcp/cafeteria?day=${day}`);
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.data);
      } else {
        setMenuItems([]);
      }
    } catch {
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(activeDay); }, [activeDay]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🍽️ Cafeteria Menu</h1>
        <p className="page-subtitle">Daily mess menu — Indian college cafeteria style.</p>
      </div>

      {/* Day Tabs */}
      <div className="tab-list overflow-x-auto pb-2">
        {DAYS.map((day, i) => (
          <button
            key={day}
            className={`tab-btn whitespace-nowrap ${activeDay === day ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}
          >
            {DAY_LABELS[i]}
            {i === todayIdx && <span style={{ marginLeft: '3px', fontSize: '8px', verticalAlign: 'super' }}>●</span>}
          </button>
        ))}
      </div>

      {/* Menu Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="card skeleton" style={{ minHeight: '200px' }} />
          ))}
        </div>
      ) : menuItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <MealSection meal="Breakfast" menuItems={menuItems} />
          <MealSection meal="Lunch" menuItems={menuItems} />
          <MealSection meal="Dinner" menuItems={menuItems} />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
          <div>No menu found for {activeDay} in the database.</div>
        </div>
      )}
    </div>
  );
}
