// Shared TypeScript types for CampusIQ

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolsCalled?: string[];
  sources?: string[];
  isLoading?: boolean;
}

export interface McpServiceStatus {
  service: string;
  label: string;
  icon: string;
  url: string;
  status: 'online' | 'offline' | 'checking';
  responseTime?: number;
  lastChecked?: string;
}

// Library types
export interface LibraryBook {
  id?: number;
  title: string;
  author: string;
  available: boolean;
  shelf?: string;
  dueDate?: string;
  genre?: string;
}

export interface LibrarySearchResult {
  source: 'library';
  query: string;
  totalResults: number;
  availableCount: number;
  results: LibraryBook[];
  message?: string | null;
}

// Cafeteria types
export interface MenuItem {
  item: string;
  description: string;
  isVeg: boolean;
  price: number;
  isSpecial?: boolean;
}

export interface DayMenu {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export interface CafeteriaMenuResult {
  source: 'cafeteria';
  day: string;
  date: string;
  specials: string;
  menu: DayMenu;
}

// Events types
export interface CampusEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  endTime?: string;
  venue: string;
  organizer: string;
  category: string;
  tags: string[];
  description: string;
  registrationLink: string | null;
  isRegistrationOpen: boolean;
  maxParticipants?: number;
  prize?: string;
  prerequisites?: string;
  note?: string;
}

export interface EventsResult {
  source: 'events';
  filter: string;
  totalEvents: number;
  filteredCount: number;
  nextEvent?: {
    name: string;
    date: string;
    time: string;
    venue: string;
  } | null;
  events: CampusEvent[];
}

// Academics types
export interface Exam {
  subject: string;
  code: string;
  date: string;
  time: string;
  venue: string;
  branch: string;
  semester: number;
}

export interface Holiday {
  date: string;
  occasion: string;
  duration: string;
  type: 'national' | 'festival';
}

export interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  subjects: string[];
  email: string;
  phone: string;
  officeHours: string;
  office: string;
  qualification: string;
  specialization: string;
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  faculty: string;
  units: { unit: number; title: string; topics: string[] }[];
  textbooks: string[];
  references: string[];
}

export interface AcademicsResult {
  source: 'academics';
  topic: string;
  data: any;
}

// API Response types
export interface AiQueryResponse {
  answer: string;
  toolsCalled: string[];
  sources: string[];
  error?: string;
}

export interface HealthCheckResponse {
  services: {
    service: string;
    label: string;
    status: 'online' | 'offline';
    responseTime: number;
    lastChecked: string;
    error?: string;
  }[];
  allOperational: boolean;
  checkedAt: string;
}

// Quick card data types
export interface QuickCardData {
  library: { availableCount: number; totalCount: number } | null;
  cafeteria: { special: string; day: string } | null;
  events: { nextEventName: string; nextEventTime: string; nextEventDate: string } | null;
  academics: { nextExamSubject: string; nextExamDate: string } | null;
}
