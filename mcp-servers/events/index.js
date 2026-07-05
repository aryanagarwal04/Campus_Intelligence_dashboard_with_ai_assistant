const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app', '*'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Campus events mock data
const campusEvents = [
  {
    id: 1,
    name: "TechFest 2025 — Annual Tech Extravaganza",
    date: "2025-07-18",
    time: "09:00 AM",
    endTime: "09:00 PM",
    venue: "Main Auditorium + Open Ground",
    organizer: "Technical Society",
    category: "tech",
    tags: ["tech", "competition", "hackathon", "robotics"],
    description: "2-day mega tech festival with hackathon, robotics arena, project expo, and guest lectures from industry leaders.",
    registrationLink: "https://campus.edu/techfest25",
    isRegistrationOpen: true,
    maxParticipants: 500,
    prize: "₹1,00,000 prize pool"
  },
  {
    id: 2,
    name: "AI/ML Workshop — Build Your First Neural Network",
    date: "2025-07-12",
    time: "10:00 AM",
    endTime: "01:00 PM",
    venue: "CS Lab 3 (Block B, Floor 2)",
    organizer: "AI Club — DeepThink",
    category: "workshop",
    tags: ["AI", "ML", "workshop", "tech"],
    description: "Hands-on workshop covering Python, NumPy, and building a neural network from scratch using TensorFlow.",
    registrationLink: "https://campus.edu/aiml-workshop",
    isRegistrationOpen: true,
    maxParticipants: 60,
    prerequisites: "Basic Python knowledge"
  },
  {
    id: 3,
    name: "Code Clash — Competitive Programming Contest",
    date: "2025-07-14",
    time: "02:00 PM",
    endTime: "05:00 PM",
    venue: "Computer Center (Main Block)",
    organizer: "ICPC Chapter",
    category: "competition",
    tags: ["coding", "competition", "tech", "programming"],
    description: "3-hour competitive programming contest on Codeforces platform. Levels: Beginner, Intermediate, Advanced.",
    registrationLink: "https://campus.edu/codeclash",
    isRegistrationOpen: true,
    maxParticipants: 150,
    prize: "₹15,000 prize pool"
  },
  {
    id: 4,
    name: "Cultural Night — Rang De Campus",
    date: "2025-07-19",
    time: "06:00 PM",
    endTime: "11:00 PM",
    venue: "Open Air Theatre",
    organizer: "Cultural Committee",
    category: "cultural",
    tags: ["cultural", "music", "dance", "drama"],
    description: "Annual cultural extravaganza featuring classical dance, fusion music, street play, and fashion show.",
    registrationLink: "https://campus.edu/cultural-night",
    isRegistrationOpen: true,
    maxParticipants: 1000
  },
  {
    id: 5,
    name: "Sports Day — Inter-Branch Championship",
    date: "2025-07-25",
    time: "07:00 AM",
    endTime: "06:00 PM",
    venue: "Sports Complex & Cricket Ground",
    organizer: "Sports Council",
    category: "sports",
    tags: ["sports", "cricket", "football", "badminton", "athletics"],
    description: "Annual sports championship across 12 branches. Events: cricket, football, basketball, badminton, 100m dash, tug of war.",
    registrationLink: "https://campus.edu/sports-day",
    isRegistrationOpen: true,
    maxParticipants: 800
  },
  {
    id: 6,
    name: "Hackathon — 24 Hours to Build",
    date: "2025-07-26",
    time: "10:00 AM",
    endTime: "2025-07-27 10:00 AM",
    venue: "Innovation Lab (New Block)",
    organizer: "Coding Club & Industry Partners",
    category: "hackathon",
    tags: ["hackathon", "tech", "coding", "innovation"],
    description: "24-hour hackathon with themes: HealthTech, EdTech, Sustainability. Mentors from top tech companies.",
    registrationLink: "https://campus.edu/hackathon25",
    isRegistrationOpen: true,
    maxParticipants: 200,
    prize: "₹2,00,000 prize pool + internship opportunities"
  },
  {
    id: 7,
    name: "Guest Lecture — Dr. K. Radhakrishnan on Space Technology",
    date: "2025-07-11",
    time: "11:00 AM",
    endTime: "12:30 PM",
    venue: "Seminar Hall 1",
    organizer: "Department of ECE & Dean's Office",
    category: "academic",
    tags: ["lecture", "space", "ISRO", "academic", "tech"],
    description: "Former ISRO Chairman Dr. K. Radhakrishnan delivers an inspiring lecture on India's space program and future missions.",
    registrationLink: "https://campus.edu/lecture-isro",
    isRegistrationOpen: false,
    note: "Registration closed — open seating for first 50 walk-ins"
  },
  {
    id: 8,
    name: "Photography Club Exhibition — Frames of Campus Life",
    date: "2025-07-15",
    time: "10:00 AM",
    endTime: "05:00 PM",
    venue: "Library Lobby & Corridor",
    organizer: "Campus Photography Club",
    category: "cultural",
    tags: ["photography", "exhibition", "art", "cultural", "club"],
    description: "Annual photography exhibition showcasing 200+ photos from campus life, nature, travel, and astrophotography.",
    registrationLink: null,
    isRegistrationOpen: false,
    note: "Open for all — free entry"
  },
  {
    id: 9,
    name: "Entrepreneurship Conclave — E-Summit 2025",
    date: "2025-08-02",
    time: "09:00 AM",
    endTime: "06:00 PM",
    venue: "Main Auditorium",
    organizer: "E-Cell",
    category: "tech",
    tags: ["startup", "entrepreneurship", "business", "innovation"],
    description: "Annual entrepreneurship summit with startup pitches, investor meets, workshops, and panel discussions.",
    registrationLink: "https://campus.edu/esummit",
    isRegistrationOpen: true,
    maxParticipants: 300,
    prize: "Funding opportunities up to ₹5,00,000"
  },
  {
    id: 10,
    name: "Debate Competition — MindStorm",
    date: "2025-07-13",
    time: "03:00 PM",
    endTime: "06:00 PM",
    venue: "Conference Room B",
    organizer: "Literary & Debating Society",
    category: "academic",
    tags: ["debate", "public speaking", "academic", "competition"],
    description: "Parliamentary-style debate on current affairs and tech ethics. Open to all branches. Individual and team categories.",
    registrationLink: "https://campus.edu/mindstorm-debate",
    isRegistrationOpen: true,
    maxParticipants: 80,
    prize: "₹8,000 prize pool + trophy"
  }
];

const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

const getThisWeekEnd = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'events', timestamp: new Date().toISOString() });
});

// Events endpoint
app.get('/events', (req, res) => {
  const { filter } = req.query;
  let results = [...campusEvents];
  let filterLabel = filter || 'upcoming';

  if (!filter || filter.toLowerCase() === 'upcoming') {
    results = campusEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    filterLabel = 'upcoming';
  } else if (filter.toLowerCase() === 'today') {
    const today = getToday();
    results = campusEvents.filter(e => e.date === today);
    filterLabel = 'today';
  } else if (filter.toLowerCase() === 'this week' || filter.toLowerCase() === 'week') {
    const weekEnd = getThisWeekEnd();
    results = campusEvents.filter(e => e.date <= weekEnd);
  } else {
    // Filter by category or tag
    const searchTerm = filter.toLowerCase();
    results = campusEvents.filter(e =>
      e.category.toLowerCase().includes(searchTerm) ||
      e.tags.some(t => t.toLowerCase().includes(searchTerm)) ||
      e.name.toLowerCase().includes(searchTerm) ||
      e.organizer.toLowerCase().includes(searchTerm)
    );
  }

  const nextEvent = campusEvents.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  res.json({
    source: 'events',
    filter: filterLabel,
    totalEvents: campusEvents.length,
    filteredCount: results.length,
    nextEvent: nextEvent ? { name: nextEvent.name, date: nextEvent.date, time: nextEvent.time, venue: nextEvent.venue } : null,
    events: results
  });
});

app.listen(PORT, () => {
  console.log(`📅 Events MCP Server running on http://localhost:${PORT}`);
});
