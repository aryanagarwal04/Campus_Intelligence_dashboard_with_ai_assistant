'use client';

import { useState, useRef, useEffect } from 'react';
import SourceBadge from './SourceBadge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolsCalled?: string[];
  sources?: string[];
  isLoading?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Is 'Clean Code' available in the library?",
  "What's for lunch today?",
  "Any tech events this week?",
  "When are the mid-semester exams?",
  "Show me Friday's cafeteria menu",
  "Who teaches Data Structures?",
];

const TOOL_LABELS: Record<string, string> = {
  search_library: 'Library',
  get_cafeteria_menu: 'Cafeteria',
  get_campus_events: 'Events',
  get_academic_info: 'Academics',
};

function MarkdownRenderer({ content }: { content: string }) {
  // Convert basic markdown to HTML
  const rendered = content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '');

  return (
    <div
      dangerouslySetInnerHTML={{ __html: `<p>${rendered}</p>` }}
      style={{ fontSize: '14px', lineHeight: 1.65 }}
    />
  );
}

function ThinkingBubble({ toolsBeingCalled }: { toolsBeingCalled: string[] }) {
  const labels = toolsBeingCalled.map(t => TOOL_LABELS[t] || t);
  const queryText = labels.length > 0
    ? `🔍 Querying ${labels.join(' + ')}...`
    : '🤔 Thinking...';

  return (
    <div className="chat-message" style={{ justifyContent: 'flex-start' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', flexShrink: 0,
      }}>
        🤖
      </div>
      <div className="chat-bubble assistant" style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 500 }}>
          {queryText}
        </div>
        <div className="thinking-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm **CampusIQ**, your unified campus assistant. I can help you with:\n\n- 📚 **Library** — book availability, reservations\n- 🍽️ **Cafeteria** — today's menu & weekly schedule\n- 📅 **Events** — upcoming fests, workshops, and clubs\n- 🎓 **Academics** — exams, syllabus, holidays, faculty\n\nWhat would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingTools, setPendingTools] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setPendingTools([]);

    // Simulate progressive tool detection (show after 1s)
    const toolTimer = setTimeout(() => {
      const queryLower = query.toLowerCase();
      const detectedTools: string[] = [];
      if (queryLower.includes('book') || queryLower.includes('library') || queryLower.includes('author')) detectedTools.push('search_library');
      if (queryLower.includes('food') || queryLower.includes('lunch') || queryLower.includes('menu') || queryLower.includes('cafeteria') || queryLower.includes('breakfast') || queryLower.includes('dinner')) detectedTools.push('get_cafeteria_menu');
      if (queryLower.includes('event') || queryLower.includes('fest') || queryLower.includes('hackathon') || queryLower.includes('workshop') || queryLower.includes('club')) detectedTools.push('get_campus_events');
      if (queryLower.includes('exam') || queryLower.includes('holiday') || queryLower.includes('faculty') || queryLower.includes('syllabus') || queryLower.includes('professor') || queryLower.includes('teacher')) detectedTools.push('get_academic_info');
      setPendingTools(detectedTools.length > 0 ? detectedTools : ['search_library']);
    }, 800);

    try {
      const res = await fetch('/api/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      clearTimeout(toolTimer);
      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.error ? `Sorry, I encountered an error: ${data.error}. Please try again.` : data.answer,
        timestamp: new Date(),
        toolsCalled: data.toolsCalled || [],
        sources: data.sources || [],
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      clearTimeout(toolTimer);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I could not connect to the AI service. Please ensure the server is running and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setPendingTools([]);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>
          🤖
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>AI Campus Assistant</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot online" style={{ width: '6px', height: '6px' }} />
            Powered by Gemini 1.5 Pro · MCP Architecture
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {['📚', '🍽️', '📅', '🎓'].map((icon, i) => (
            <span key={i} style={{ fontSize: '14px', opacity: 0.5 }}>{icon}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'user' ? (
              <div className="chat-message" style={{ justifyContent: 'flex-end' }}>
                <div className="chat-bubble user">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="chat-message" style={{ justifyContent: 'flex-start' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0, marginTop: '2px',
                }}>
                  🤖
                </div>
                <div style={{ maxWidth: '82%' }}>
                  <div className="chat-bubble assistant">
                    <MarkdownRenderer content={msg.content} />
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px', paddingLeft: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-faint)', alignSelf: 'center' }}>Sources:</span>
                      {msg.sources.map((src) => (
                        <SourceBadge key={src} source={src} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && <ThinkingBubble toolsBeingCalled={pendingTools} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !isLoading && (
        <div style={{ padding: '0 20px 12px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button key={q} className="suggestion-pill" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: '10px', alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about campus — books, food, events, exams..."
          rows={1}
          disabled={isLoading}
          style={{
            resize: 'none',
            minHeight: '44px',
            maxHeight: '120px',
            overflowY: 'auto',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
          onInput={e => {
            const t = e.target as HTMLTextAreaElement;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 120) + 'px';
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          style={{
            minWidth: '44px', height: '44px', padding: '0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius-lg)',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '18px',
          }}
        >
          {isLoading ? (
            <span style={{ fontSize: '14px' }} className="spin">⟳</span>
          ) : '↑'}
        </button>
      </div>
    </div>
  );
}
