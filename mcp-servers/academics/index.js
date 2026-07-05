const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3004;

app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app', '*'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Indian academic calendar mock data
const academicData = {
  exam_schedule: {
    semester: "Even Semester 2024-25",
    midSem: {
      label: "Mid-Semester Examinations",
      startDate: "2025-07-14",
      endDate: "2025-07-19",
      exams: [
        { subject: "Data Structures & Algorithms", code: "CS301", date: "2025-07-14", time: "10:00 AM - 12:00 PM", venue: "Exam Hall A & B", branch: "CS/IT", semester: 3 },
        { subject: "Digital Electronics", code: "EC201", date: "2025-07-14", time: "02:00 PM - 04:00 PM", venue: "Exam Hall C", branch: "ECE", semester: 3 },
        { subject: "Engineering Mathematics III", code: "MA301", date: "2025-07-15", time: "10:00 AM - 12:00 PM", venue: "Exam Hall A, B & C", branch: "All Branches", semester: 3 },
        { subject: "Computer Networks", code: "CS401", date: "2025-07-15", time: "02:00 PM - 04:00 PM", venue: "Exam Hall A", branch: "CS/IT", semester: 4 },
        { subject: "Database Management Systems", code: "CS402", date: "2025-07-16", time: "10:00 AM - 12:00 PM", venue: "Exam Hall B", branch: "CS/IT", semester: 4 },
        { subject: "Operating Systems", code: "CS403", date: "2025-07-17", time: "10:00 AM - 12:00 PM", venue: "Exam Hall A & B", branch: "CS/IT", semester: 5 },
        { subject: "Signals & Systems", code: "EC301", date: "2025-07-17", time: "02:00 PM - 04:00 PM", venue: "Exam Hall C", branch: "ECE", semester: 5 },
        { subject: "Artificial Intelligence", code: "CS501", date: "2025-07-18", time: "10:00 AM - 12:00 PM", venue: "Exam Hall A", branch: "CS/IT", semester: 5 },
        { subject: "Software Engineering", code: "CS502", date: "2025-07-19", time: "10:00 AM - 12:00 PM", venue: "Exam Hall B & C", branch: "CS/IT", semester: 5 }
      ]
    },
    endSem: {
      label: "End-Semester Examinations",
      startDate: "2025-11-17",
      endDate: "2025-11-30",
      note: "Detailed schedule will be announced in October 2025"
    },
    nextExam: {
      subject: "Data Structures & Algorithms",
      date: "2025-07-14",
      time: "10:00 AM",
      venue: "Exam Hall A & B",
      daysLeft: 3
    }
  },
  holidays: {
    academicYear: "2024-25",
    holidays: [
      { date: "2025-07-17", occasion: "Muharram", duration: "1 day", type: "national" },
      { date: "2025-08-15", occasion: "Independence Day", duration: "1 day", type: "national" },
      { date: "2025-08-16", occasion: "Independence Day (compensatory)", duration: "1 day", type: "national" },
      { date: "2025-08-27", occasion: "Janmashtami", duration: "1 day", type: "national" },
      { date: "2025-10-02", occasion: "Gandhi Jayanti", duration: "1 day", type: "national" },
      { date: "2025-10-20", occasion: "Diwali Break Begins", duration: "5 days (20–24 Oct)", type: "festival" },
      { date: "2025-10-21", occasion: "Diwali (Lakshmi Puja)", duration: "", type: "festival" },
      { date: "2025-10-22", occasion: "Diwali", duration: "", type: "festival" },
      { date: "2025-10-23", occasion: "Diwali (Govardhan Puja)", duration: "", type: "festival" },
      { date: "2025-10-24", occasion: "Bhai Dooj", duration: "", type: "festival" },
      { date: "2025-11-05", occasion: "Guru Nanak Jayanti", duration: "1 day", type: "national" },
      { date: "2025-12-25", occasion: "Christmas Day", duration: "1 day", type: "national" },
      { date: "2026-01-14", occasion: "Makar Sankranti / Pongal", duration: "1 day", type: "national" },
      { date: "2026-01-26", occasion: "Republic Day", duration: "1 day", type: "national" },
      { date: "2026-02-26", occasion: "Maha Shivratri", duration: "1 day", type: "national" },
      { date: "2026-03-26", occasion: "Holi", duration: "2 days (26–27 Mar)", type: "festival" },
      { date: "2026-03-30", occasion: "Id-ul-Fitr (Eid)", duration: "1 day", type: "national" },
      { date: "2026-04-02", occasion: "Ram Navami", duration: "1 day", type: "national" },
      { date: "2026-04-03", occasion: "Good Friday", duration: "1 day", type: "national" }
    ],
    upcomingHoliday: { date: "2025-07-17", occasion: "Muharram", daysLeft: 6 },
    summerBreak: { startDate: "2025-05-15", endDate: "2025-06-30", label: "Summer Vacation (already passed)" }
  },
  syllabus: {
    semester: 5,
    branch: "Computer Science & Engineering",
    subjects: [
      {
        code: "CS501",
        name: "Artificial Intelligence",
        credits: 4,
        faculty: "Dr. Priya Sharma",
        units: [
          { unit: 1, title: "Introduction to AI", topics: ["History of AI", "Intelligent Agents", "Problem Solving", "Uninformed Search: BFS, DFS, IDDFS"] },
          { unit: 2, title: "Informed Search & CSP", topics: ["A* Algorithm", "Hill Climbing", "Simulated Annealing", "Constraint Satisfaction Problems"] },
          { unit: 3, title: "Knowledge Representation", topics: ["Logic: Propositional & First-Order", "Inference Rules", "Resolution", "Forward & Backward Chaining"] },
          { unit: 4, title: "Machine Learning Basics", topics: ["Supervised Learning", "Decision Trees", "Neural Network Intro", "Naive Bayes"] },
          { unit: 5, title: "Natural Language Processing", topics: ["NLP Pipeline", "Tokenization", "POS Tagging", "Sentiment Analysis Basics"] }
        ],
        textbooks: ["Artificial Intelligence: A Modern Approach — Russell & Norvig", "Artificial Intelligence — Rich & Knight"],
        references: ["Deep Learning — Goodfellow", "Pattern Recognition — Bishop"]
      },
      {
        code: "CS502",
        name: "Software Engineering",
        credits: 3,
        faculty: "Prof. Rajesh Kumar",
        units: [
          { unit: 1, title: "SDLC & Process Models", topics: ["Waterfall", "Agile", "Scrum", "Spiral Model"] },
          { unit: 2, title: "Requirements Engineering", topics: ["Functional & Non-functional Requirements", "Use Case Diagrams", "User Stories"] },
          { unit: 3, title: "Software Design", topics: ["Design Principles", "UML Diagrams", "Architectural Patterns", "Design Patterns"] },
          { unit: 4, title: "Testing", topics: ["Unit Testing", "Integration Testing", "System Testing", "TDD"] },
          { unit: 5, title: "Project Management", topics: ["Cost Estimation", "COCOMO", "Risk Management", "Agile Estimation"] }
        ],
        textbooks: ["Software Engineering — Ian Sommerville", "Software Engineering — Pressman"],
        references: ["Clean Code — Robert Martin", "The Pragmatic Programmer"]
      },
      {
        code: "CS503",
        name: "Computer Networks",
        credits: 4,
        faculty: "Dr. Anil Verma",
        units: [
          { unit: 1, title: "Introduction & Physical Layer", topics: ["OSI Model", "TCP/IP Stack", "Transmission Media", "Encoding"] },
          { unit: 2, title: "Data Link Layer", topics: ["Framing", "Error Detection (CRC)", "CSMA/CD", "MAC Protocols"] },
          { unit: 3, title: "Network Layer", topics: ["IP Addressing", "Subnetting", "Routing Algorithms", "BGP, OSPF"] },
          { unit: 4, title: "Transport Layer", topics: ["TCP", "UDP", "Congestion Control", "3-Way Handshake"] },
          { unit: 5, title: "Application Layer", topics: ["HTTP/HTTPS", "DNS", "SMTP", "FTP", "WebSockets"] }
        ],
        textbooks: ["Computer Networks — Tanenbaum", "Data Communications & Networking — Forouzan"],
        references: ["Computer Networking: A Top-Down Approach — Kurose & Ross"]
      }
    ]
  },
  faculty: {
    department: "Computer Science & Engineering",
    faculty: [
      {
        id: 1,
        name: "Dr. Priya Sharma",
        designation: "Professor & Head of Department",
        subjects: ["Artificial Intelligence", "Machine Learning", "Research Methodology"],
        email: "priya.sharma@campus.edu",
        phone: "+91-9876543210",
        officeHours: "Monday & Wednesday: 11 AM - 1 PM",
        office: "CS Block, Room 201",
        qualification: "PhD (IIT Bombay), M.Tech (NIT Trichy)",
        specialization: "AI, ML, Computer Vision"
      },
      {
        id: 2,
        name: "Prof. Rajesh Kumar",
        designation: "Associate Professor",
        subjects: ["Software Engineering", "Project Management", "Agile Development"],
        email: "rajesh.kumar@campus.edu",
        phone: "+91-9876543211",
        officeHours: "Tuesday & Thursday: 10 AM - 12 PM",
        office: "CS Block, Room 203",
        qualification: "M.Tech (IIT Delhi), B.Tech (NIT Warangal)",
        specialization: "Software Engineering, DevOps"
      },
      {
        id: 3,
        name: "Dr. Anil Verma",
        designation: "Associate Professor",
        subjects: ["Computer Networks", "Cybersecurity", "Cloud Computing"],
        email: "anil.verma@campus.edu",
        phone: "+91-9876543212",
        officeHours: "Monday, Wednesday & Friday: 3 PM - 4 PM",
        office: "CS Block, Room 205",
        qualification: "PhD (IIT Kanpur)",
        specialization: "Network Security, Distributed Systems"
      },
      {
        id: 4,
        name: "Dr. Meena Patel",
        designation: "Assistant Professor",
        subjects: ["Database Management Systems", "Big Data Analytics", "NoSQL"],
        email: "meena.patel@campus.edu",
        phone: "+91-9876543213",
        officeHours: "Tuesday & Friday: 2 PM - 4 PM",
        office: "CS Block, Room 207",
        qualification: "PhD (IIT Hyderabad), M.Tech (BITS Pilani)",
        specialization: "Database Systems, Data Mining"
      },
      {
        id: 5,
        name: "Prof. Suresh Nair",
        designation: "Assistant Professor",
        subjects: ["Data Structures & Algorithms", "Competitive Programming", "Algorithm Design"],
        email: "suresh.nair@campus.edu",
        phone: "+91-9876543214",
        officeHours: "Wednesday & Thursday: 11 AM - 1 PM",
        office: "CS Block, Room 209",
        qualification: "M.Tech (IISc Bangalore)",
        specialization: "Algorithms, Combinatorics"
      },
      {
        id: 6,
        name: "Dr. Kavita Singh",
        designation: "Assistant Professor",
        subjects: ["Operating Systems", "Systems Programming", "Embedded Systems"],
        email: "kavita.singh@campus.edu",
        phone: "+91-9876543215",
        officeHours: "Monday & Thursday: 10 AM - 12 PM",
        office: "CS Block, Room 211",
        qualification: "PhD (IIT Madras)",
        specialization: "OS Design, Real-time Systems"
      }
    ]
  }
};

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'academics', timestamp: new Date().toISOString() });
});

// Info endpoint
app.get('/info', (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'topic parameter required. Use: exam_schedule, syllabus, holidays, faculty' });
  }

  const data = academicData[topic.toLowerCase()];
  if (!data) {
    return res.status(404).json({
      error: `Topic "${topic}" not found. Available topics: exam_schedule, syllabus, holidays, faculty`,
      availableTopics: Object.keys(academicData)
    });
  }

  res.json({
    source: 'academics',
    topic,
    data
  });
});

app.listen(PORT, () => {
  console.log(`🎓 Academics MCP Server running on http://localhost:${PORT}`);
});
