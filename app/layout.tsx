import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'CampusIQ — Unified Campus Intelligence Dashboard',
  description:
    'One AI-powered dashboard for your entire campus: library, cafeteria, events, and academics. Powered by Google Gemini and MCP architecture.',
  keywords: ['campus dashboard', 'university AI', 'MCP', 'Gemini AI', 'student portal'],
  authors: [{ name: 'CampusIQ Team' }],
  openGraph: {
    title: 'CampusIQ — Unified Campus Intelligence Dashboard',
    description: 'Ask anything about your campus — books, food, events, exams.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
