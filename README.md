# CampusIQ — Unified Campus Intelligence Dashboard

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-1.5--Pro-blue?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-purple)

> **One AI-powered dashboard for your entire campus** — library books, mess menu, events, and exams, all answered in a single natural language query.
> 
> 🚀 **Live Demo:** [thecampushive.vercel.app](https://thecampushive.vercel.app/)

---

## 🎯 The Problem

Students at Indian engineering colleges navigate **5+ separate portals** every day:
- Library portal (to check book availability)
- Mess / Cafeteria portal (to see today's menu)
- Events board (scattered across WhatsApp groups)
- Academic portal (exam schedules, holiday lists)
- Faculty directory (to find who teaches what)

This wastes time and fragments information that should be instant.

---

## 💡 The Solution

**CampusIQ** is a unified intelligence layer powered by Google Gemini AI and the **Model Context Protocol (MCP)** architecture.

A student types: _"Is Clean Code available? Also what's for lunch?"_

The AI automatically:
1. Identifies relevant data sources
2. Calls the Library MCP server AND the Cafeteria MCP server in parallel
3. Returns a single, coherent natural language answer

---

## ✨ Features

- 🤖 **AI Chat Assistant** — Natural language queries routed to the right campus data source
- 📚 **Library Search** — Real-time book availability, shelf location, author search
- 🍽️ **Cafeteria Menu** — Daily menu with breakfast, lunch & dinner (Indian food!)
- 📅 **Events Board** — Filtered campus events: tech, cultural, sports, hackathons
- 🎓 **Academics Hub** — Exam schedules, holiday calendar, syllabus, faculty contacts
- 🔧 **System Status** — Live health monitoring of all MCP servers with auto-refresh
- 🔍 **MCP Architecture** — Each data source is an independent microservice
- ⚡ **Gemini Function Calling** — AI decides which services to query based on intent
- 💎 **Premium Dark UI** — Glassmorphism-inspired, deep navy design with Inter font

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 14 Frontend             │
│  Dashboard + AI Chat Interface          │
└────────────────┬────────────────────────┘
                 │ HTTP POST /api/ai-query
┌────────────────▼────────────────────────┐
│     Next.js API Route (Orchestrator)    │
│  Gemini 1.5 Pro with Function Calling  │
└──┬──────────┬──────────┬──────────┬─────┘
   │          │          │          │
   ▼          ▼          ▼          ▼
:3001       :3002       :3003      :3004
Library   Cafeteria   Events   Academics
MCP        MCP        MCP        MCP
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | React framework with server/client components |
| Styling | Vanilla CSS + Tailwind | Custom design system, no framework lock-in |
| AI Model | Any OpenRouter Model (e.g. Llama 3.3, Gemini 2.0) | Natural language understanding + function calling |
| AI SDK | openai (Node SDK) | Standardized OpenAI function declarations & chat sessions via OpenRouter |
| MCP Servers | Node.js + Express.js | Independent campus data microservices |
| Architecture | MCP (Model Context Protocol) | Standardized AI tool-calling pattern |

---

## 📋 Prerequisites

- **Node.js 18+** (download from https://nodejs.org)
- **npm** (comes with Node.js)
- **OpenRouter API Key** — Get yours free at https://openrouter.ai/

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/campus-iq.git
cd campus-iq/campus-dashboard
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install MCP server dependencies

```bash
# Run these in separate terminals or use the batch script below
cd mcp-servers/library && npm install
cd mcp-servers/cafeteria && npm install
cd mcp-servers/events && npm install
cd mcp-servers/academics && npm install
```

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 5. Start all 4 MCP servers (4 separate terminals)

```bash
# Terminal 1
cd mcp-servers/library && node index.js

# Terminal 2
cd mcp-servers/cafeteria && node index.js

# Terminal 3
cd mcp-servers/events && node index.js

# Terminal 4
cd mcp-servers/academics && node index.js
```

### 6. Start the Next.js development server

```bash
# From campus-dashboard/ directory
npm run dev
```

### 7. Open the dashboard

Navigate to **http://localhost:3000** 🎉

---

## 💬 Example Queries to Try

Once running, try these in the AI chat:

| Query | Services Called |
|-------|----------------|
| "Is Clean Code available in the library?" | 📚 Library |
| "What's for lunch today?" | 🍽️ Cafeteria |
| "Any hackathons or tech events this week?" | 📅 Events |
| "When are the mid-semester exams?" | 🎓 Academics |
| "Show me Friday's dinner menu" | 🍽️ Cafeteria |
| "Who teaches Data Structures? And what are the holidays?" | 🎓 Academics |
| "I need books on AI and also what's the next event?" | 📚 Library + 📅 Events |

---

## 📁 Project Structure

```
campus-dashboard/
├── app/
│   ├── page.tsx                   # Main dashboard (Quick Cards + Chat)
│   ├── library/page.tsx           # Library search page
│   ├── cafeteria/page.tsx         # Cafeteria menu with day tabs
│   ├── events/page.tsx            # Events board with filters
│   ├── academics/page.tsx         # Exam schedule, holidays, faculty
│   ├── status/page.tsx            # MCP server health monitoring
│   ├── api/
│   │   ├── ai-query/route.ts      # Gemini AI orchestrator
│   │   └── health-check/route.ts  # Aggregated MCP health check
│   ├── layout.tsx                 # Root layout with sidebar
│   └── globals.css                # Design system CSS
├── components/
│   ├── Sidebar.tsx                # Navigation + live status dots
│   ├── ChatInterface.tsx          # AI chat UI with thinking state
│   ├── QuickCards.tsx             # Summary cards with skeleton loading
│   ├── McpStatusBadge.tsx         # Status indicator dot
│   └── SourceBadge.tsx            # Source attribution pill
├── lib/
│   └── gemini.ts                  # Gemini client + function declarations
├── types/
│   └── index.ts                   # Shared TypeScript types
├── mcp-servers/
│   ├── library/                   # Express server on :3001
│   ├── cafeteria/                 # Express server on :3002
│   ├── events/                    # Express server on :3003
│   └── academics/                 # Express server on :3004
├── .env.example
├── .env.local
└── README.md
```

---

## 🌐 Deployment

### Frontend — Vercel

1. Push the `campus-dashboard/` directory to GitHub
2. Import to Vercel at https://vercel.com/import
3. Add environment variables in Vercel dashboard:
   - `OPENROUTER_API_KEY` = your key
   - `LIBRARY_MCP_URL` = your Render URL for library
   - `CAFETERIA_MCP_URL` = your Render URL for cafeteria
   - `EVENTS_MCP_URL` = your Render URL for events
   - `ACADEMICS_MCP_URL` = your Render URL for academics

### MCP Servers — Render

1. Create a new **Web Service** on https://render.com for each MCP server
2. Connect your GitHub repo
3. Set **Root Directory** to `campus-dashboard/mcp-servers/library` (or the respective folder)
4. Set **Start Command** to `node index.js`
5. Set **Environment**: `Node` with version `18`
6. Repeat for all 4 MCP servers

---

## 🚀 Live Demo

> 🌐 [The Campus Hive — Live Website](https://thecampushive.vercel.app/)
> 
> 🎉 *The project has been successfully completed and deployed.*

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">
  <strong>Built with ❤️ for hackathon — Powered by OpenRouter AI & MCP Architecture</strong>
</div>
