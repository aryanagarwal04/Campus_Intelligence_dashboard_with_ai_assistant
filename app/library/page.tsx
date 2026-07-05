'use client';

import { useState, useEffect } from 'react';

interface Book {
  _id?: string;
  title: string;
  author: string;
  availability: string;
  shelf?: string;
  category?: string;
}

function StatusChip({ availability }: { availability: string }) {
  const isAvailable = availability === 'Available';
  return (
    <span className={`badge ${isAvailable ? 'badge-success' : 'badge-error'}`}>
      {isAvailable ? '✓ Available' : `✗ ${availability}`}
    </span>
  );
}

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [stats, setStats] = useState({ available: 0, total: 0 });

  // Load all books on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/mcp/library');
        const data = await res.json();
        const results = data.data || [];
        setResults(results);
        setStats({ 
          available: results.filter((b: Book) => b.availability === 'Available').length, 
          total: results.length 
        });
        setSearched(true);
      } catch {
        setResults([]);
      }
    };
    fetchAll();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/mcp/library?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const results = data.data || [];
      setResults(results);
      setStats({ 
        available: results.filter((b: Book) => b.availability === 'Available').length, 
        total: results.length 
      });
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📚 Library</h1>
        <p className="page-subtitle">Search for books, check availability, and find shelf locations.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '22px' }}>📚</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.total}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Books</div>
          </div>
        </div>
        <div style={{ padding: '10px 16px', background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '22px' }}>✅</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)', lineHeight: 1 }}>{stats.available}</div>
            <div style={{ fontSize: '11px', color: 'var(--success)' }}>Available Now</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          className="input"
          type="text"
          placeholder="Search by title, author, or genre (e.g. 'Clean Code', 'Knuth', 'AI')"
          value={query}
          onChange={e => setQuery(e.target.value)}
          id="library-search"
        />
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '100px' }}>
          {loading ? '🔍 Searching...' : '🔍 Search'}
        </button>
        {query && (
          <button type="button" className="btn btn-ghost" onClick={() => { setQuery(''); handleSearch(); }}>
            Clear
          </button>
        )}
      </form>

      {/* Results Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>
            {query ? `Results for "${query}"` : 'All Books in Catalog'}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{results.length} book{results.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
            <div>Searching library database...</div>
          </div>
        ) : results.length === 0 && searched ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>No books found</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Try a different search term or browse all books</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th>Shelf / Due Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((book, idx) => (
                  <tr key={book._id || idx}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: '200px' }}>
                      {book.title}
                    </td>
                    <td>{book.author}</td>
                    <td>
                      {book.category && (
                        <span className="badge badge-info" style={{ fontWeight: 500 }}>{book.category}</span>
                      )}
                    </td>
                    <td><StatusChip availability={book.availability} /></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      <span style={{ color: book.availability === 'Available' ? 'var(--success)' : 'var(--error)' }}>
                        {book.shelf || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
