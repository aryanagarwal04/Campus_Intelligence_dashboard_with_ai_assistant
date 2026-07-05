import OpenAI from 'openai';

// Singleton OpenRouter client
let openaiInstance: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY environment variable is not set');
    }
    openaiInstance = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000', // Optional, for including your app on openrouter.ai rankings
        'X-Title': 'CampusIQ', // Optional. Shows in rankings on openrouter.ai
      },
    });
  }
  return openaiInstance;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// MCP server URL configuration (now pointing to internal Next.js API routes)
export const MCP_URLS = {
  search_library: (args: { query: string }) =>
    `${BASE_URL}/api/mcp/library?query=${encodeURIComponent(args.query || '')}`,
  get_cafeteria_menu: (args: { day?: string }) =>
    `${BASE_URL}/api/mcp/cafeteria?day=${args.day || 'today'}`,
  get_campus_events: (args: { filter?: string }) =>
    `${BASE_URL}/api/mcp/events?category=${encodeURIComponent(args.filter || 'upcoming')}`,
  get_academic_info: (args: { topic: string }) =>
    `${BASE_URL}/api/mcp/academics?type=${args.topic}`,
};

// Function declarations for OpenRouter (OpenAI format)
export const campusFunctions: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_library',
      description:
        'Search the campus library for book availability, titles, authors, shelf locations. Use when the student asks about books, availability, borrowing, or library resources.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Book title, author name, or topic to search for in the library',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_cafeteria_menu',
      description:
        'Get the campus cafeteria or mess menu for today or a specific day. Use when student asks about food, meals, lunch, dinner, breakfast, today\'s menu, or what\'s being served.',
      parameters: {
        type: 'object',
        properties: {
          day: {
            type: 'string',
            description:
              'Day of week: today, monday, tuesday, wednesday, thursday, friday, saturday, sunday',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_campus_events',
      description:
        'Get upcoming campus events, workshops, tech fests, hackathons, club activities and their schedules. Use when student asks about events, activities, what\'s happening, fests, or clubs.',
      parameters: {
        type: 'object',
        properties: {
          filter: {
            type: 'string',
            description:
              'Filter events by: upcoming, today, or a specific club or event type name',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_academic_info',
      description:
        'Get academic information including exam schedules, syllabus details, holiday list, and faculty contacts. Use when student asks about exams, timetable, holidays, syllabus, or professors.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'One of: exam_schedule, syllabus, holidays, faculty',
          },
        },
        required: ['topic'],
      },
    },
  },
];

// Source label mapping
export const SOURCE_LABELS: Record<string, string> = {
  search_library: '📚 Library',
  get_cafeteria_menu: '🍽️ Cafeteria',
  get_campus_events: '📅 Events',
  get_academic_info: '🎓 Academics',
};

// Health check URLs (pointing to internal API routes)
export const HEALTH_URLS = {
  library: {
    label: 'Library DB',
    icon: '📚',
    url: `${BASE_URL}/api/mcp/library`,
  },
  cafeteria: {
    label: 'Cafeteria DB',
    icon: '🍽️',
    url: `${BASE_URL}/api/mcp/cafeteria`,
  },
  events: {
    label: 'Events DB',
    icon: '📅',
    url: `${BASE_URL}/api/mcp/events`,
  },
  academics: {
    label: 'Academics DB',
    icon: '🎓',
    url: `${BASE_URL}/api/mcp/academics`,
  },
};
