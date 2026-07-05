'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'library' | 'events' | 'cafeteria' | 'academics'>('library');
  const [loading, setLoading] = useState(true);
  
  // Library State
  const [books, setBooks] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  
  // Events State
  const [events, setEvents] = useState<any[]>([]);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  // Cafeteria State
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [newMenuDay, setNewMenuDay] = useState('Monday');
  const [newMenuMeal, setNewMenuMeal] = useState('Breakfast');
  const [newMenuFood, setNewMenuFood] = useState('');

  // Academics State
  const [academics, setAcademics] = useState<any[]>([]);
  const [newAcadType, setNewAcadType] = useState('Exam');
  const [newAcadTitle, setNewAcadTitle] = useState('');
  const [newAcadDate, setNewAcadDate] = useState('');
  const [newAcadDetails, setNewAcadDetails] = useState('');
  const [newAcadDept, setNewAcadDept] = useState('');

  const fetchBooks = async () => { try { const res = await fetch('/api/mcp/library'); const data = await res.json(); if (data.success) setBooks(data.data); } catch (e) { console.error(e); } };
  const fetchEvents = async () => { try { const res = await fetch('/api/mcp/events'); const data = await res.json(); if (data.success) setEvents(data.data); } catch (e) { console.error(e); } };
  const fetchMenu = async () => { try { const res = await fetch('/api/mcp/cafeteria'); const data = await res.json(); if (data.success) setMenuItems(data.data); } catch (e) { console.error(e); } };
  const fetchAcademics = async () => { try { const res = await fetch('/api/mcp/academics'); const data = await res.json(); if (data.success) setAcademics(data.data); } catch (e) { console.error(e); } };

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'library') fetchBooks().then(() => setLoading(false));
    if (activeTab === 'events') fetchEvents().then(() => setLoading(false));
    if (activeTab === 'cafeteria') fetchMenu().then(() => setLoading(false));
    if (activeTab === 'academics') fetchAcademics().then(() => setLoading(false));
  }, [activeTab]);

  // --- LIBRARY HANDLERS ---
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newTitle || !newAuthor) return;
    try { await fetch('/api/mcp/library', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle, author: newAuthor, category: 'General', availability: 'Available', shelf: 'A-1' }) }); setNewTitle(''); setNewAuthor(''); fetchBooks(); } catch (e) { console.error(e); }
  };
  const handleDeleteBook = async (id: string) => { if (!confirm('Delete this book?')) return; try { await fetch(`/api/mcp/library?id=${id}`, { method: 'DELETE' }); fetchBooks(); } catch (e) { console.error(e); } };
  const handleToggleBook = async (book: any) => { try { await fetch('/api/mcp/library', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: book._id, availability: book.availability === 'Available' ? 'Checked Out' : 'Available' }) }); fetchBooks(); } catch (e) { console.error(e); } };

  // --- EVENTS HANDLERS ---
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newEventName || !newEventDate) return;
    try { await fetch('/api/mcp/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newEventName, date: newEventDate, category: 'Other', venue: 'TBD', organizer: 'Admin' }) }); setNewEventName(''); setNewEventDate(''); fetchEvents(); } catch (e) { console.error(e); }
  };
  const handleDeleteEvent = async (id: string) => { if (!confirm('Delete this event?')) return; try { await fetch(`/api/mcp/events?id=${id}`, { method: 'DELETE' }); fetchEvents(); } catch (e) { console.error(e); } };

  // --- CAFETERIA HANDLERS ---
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newMenuFood) return;
    try { await fetch('/api/mcp/cafeteria', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ day: newMenuDay, meal: newMenuMeal, items: newMenuFood.split(',').map(s => s.trim()), timing: 'Standard Timing' }) }); setNewMenuFood(''); fetchMenu(); } catch (e) { console.error(e); }
  };
  const handleDeleteMenu = async (id: string) => { if (!confirm('Delete this menu record?')) return; try { await fetch(`/api/mcp/cafeteria?id=${id}`, { method: 'DELETE' }); fetchMenu(); } catch (e) { console.error(e); } };

  // --- ACADEMICS HANDLERS ---
  const handleAddAcademic = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newAcadTitle || !newAcadDetails) return;
    try { 
      await fetch('/api/mcp/academics', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ type: newAcadType, title: newAcadTitle, date: newAcadDate || null, details: newAcadDetails, department: newAcadDept || 'General' }) 
      }); 
      setNewAcadTitle(''); setNewAcadDetails(''); fetchAcademics(); 
    } catch (e) { console.error(e); }
  };
  const handleDeleteAcademic = async (id: string) => { if (!confirm('Delete this academic record?')) return; try { await fetch(`/api/mcp/academics?id=${id}`, { method: 'DELETE' }); fetchAcademics(); } catch (e) { console.error(e); } };

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Database Admin Panel</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('library')} className={`px-4 py-2 font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'library' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-white'}`}>📚 Library</button>
        <button onClick={() => setActiveTab('events')} className={`px-4 py-2 font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'events' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-white'}`}>📅 Events</button>
        <button onClick={() => setActiveTab('cafeteria')} className={`px-4 py-2 font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'cafeteria' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-white'}`}>🍽️ Cafeteria</button>
        <button onClick={() => setActiveTab('academics')} className={`px-4 py-2 font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'academics' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-white'}`}>🎓 Academics</button>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
        {loading ? <p className="text-gray-400">Loading records...</p> : 
        
        activeTab === 'library' ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Library Collection</h2>
            <form onSubmit={handleAddBook} className="mb-6 flex gap-4 flex-wrap">
              <input type="text" placeholder="Book Title" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[200px]" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <input type="text" placeholder="Author" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[200px]" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium">+ Add Book</button>
            </form>
            <div className="overflow-x-auto"><table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-900 text-gray-400 text-sm uppercase"><th className="p-4">Title</th><th className="p-4">Author</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-700">{books.map(book => (<tr key={book._id} className="hover:bg-gray-700/50"><td className="p-4 font-medium">{book.title}</td><td className="p-4 text-gray-300">{book.author}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${book.availability === 'Available' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{book.availability}</span></td><td className="p-4 flex gap-2"><button onClick={() => handleToggleBook(book)} className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm">Toggle Status</button><button onClick={() => handleDeleteBook(book._id)} className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-sm">Delete</button></td></tr>))}</tbody>
            </table></div>
          </>
        ) : activeTab === 'events' ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Events Collection</h2>
            <form onSubmit={handleAddEvent} className="mb-6 flex gap-4 flex-wrap">
              <input type="text" placeholder="Event Name" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[200px]" value={newEventName} onChange={e => setNewEventName(e.target.value)} />
              <input type="date" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[200px]" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium">+ Add Event</button>
            </form>
            <div className="overflow-x-auto"><table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-900 text-gray-400 text-sm uppercase"><th className="p-4">Name</th><th className="p-4">Date</th><th className="p-4">Category</th><th className="p-4">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-700">{events.map(event => (<tr key={event._id} className="hover:bg-gray-700/50"><td className="p-4 font-medium">{event.name}</td><td className="p-4 text-gray-300">{new Date(event.date).toLocaleDateString()}</td><td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-purple-900/50 text-purple-400">{event.category}</span></td><td className="p-4 flex gap-2"><button onClick={() => handleDeleteEvent(event._id)} className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-sm">Delete</button></td></tr>))}</tbody>
            </table></div>
          </>
        ) : activeTab === 'cafeteria' ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Cafeteria Menu Collection</h2>
            <form onSubmit={handleAddMenu} className="mb-6 flex gap-4 flex-wrap">
              <select className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white" value={newMenuDay} onChange={e => setNewMenuDay(e.target.value)}><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option></select>
              <select className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white" value={newMenuMeal} onChange={e => setNewMenuMeal(e.target.value)}><option>Breakfast</option><option>Lunch</option><option>Snacks</option><option>Dinner</option></select>
              <input type="text" placeholder="Food items (comma separated)" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[200px]" value={newMenuFood} onChange={e => setNewMenuFood(e.target.value)} />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium">+ Add Menu</button>
            </form>
            <div className="overflow-x-auto"><table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-900 text-gray-400 text-sm uppercase"><th className="p-4">Day</th><th className="p-4">Meal</th><th className="p-4">Items</th><th className="p-4">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-700">{menuItems.map(menu => (<tr key={menu._id} className="hover:bg-gray-700/50"><td className="p-4 font-medium">{menu.day}</td><td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-yellow-900/50 text-yellow-400">{menu.meal}</span></td><td className="p-4 text-gray-300 text-sm">{menu.items.join(', ')}</td><td className="p-4 flex gap-2"><button onClick={() => handleDeleteMenu(menu._id)} className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-sm">Delete</button></td></tr>))}</tbody>
            </table></div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Academics Collection</h2>
            <form onSubmit={handleAddAcademic} className="mb-6 flex gap-4 flex-wrap">
              <select className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white" value={newAcadType} onChange={e => setNewAcadType(e.target.value)}><option>Exam</option><option>Holiday</option><option>Faculty</option></select>
              <input type="text" placeholder="Title/Name" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[150px]" value={newAcadTitle} onChange={e => setNewAcadTitle(e.target.value)} />
              <input type="text" placeholder="Details/Description" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[200px]" value={newAcadDetails} onChange={e => setNewAcadDetails(e.target.value)} />
              <input type="text" placeholder="Dept (Optional)" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg flex-1 min-w-[150px]" value={newAcadDept} onChange={e => setNewAcadDept(e.target.value)} />
              <input type="date" className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white" value={newAcadDate} onChange={e => setNewAcadDate(e.target.value)} />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium">+ Add Record</button>
            </form>
            <div className="overflow-x-auto"><table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-900 text-gray-400 text-sm uppercase"><th className="p-4">Type</th><th className="p-4">Title</th><th className="p-4">Details</th><th className="p-4">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-700">{academics.map(acad => (<tr key={acad._id} className="hover:bg-gray-700/50"><td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-blue-900/50 text-blue-400">{acad.type}</span></td><td className="p-4 font-medium">{acad.title}</td><td className="p-4 text-gray-300 text-sm">{acad.details}</td><td className="p-4 flex gap-2"><button onClick={() => handleDeleteAcademic(acad._id)} className="bg-red-600/80 hover:bg-red-600 px-3 py-1 rounded text-sm">Delete</button></td></tr>))}</tbody>
            </table></div>
          </>
        )}
      </div>
    </div>
  );
}
