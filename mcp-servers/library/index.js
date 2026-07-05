const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app', '*'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Mock library database
const libraryBooks = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", available: true, shelf: "A-12", genre: "Programming" },
  { id: 2, title: "The Pragmatic Programmer", author: "Hunt & Thomas", available: false, dueDate: "2025-07-10", shelf: "A-15", genre: "Programming" },
  { id: 3, title: "Design Patterns", author: "Gang of Four", available: true, shelf: "B-03", genre: "Software Engineering" },
  { id: 4, title: "Introduction to Algorithms", author: "CLRS", available: true, shelf: "C-07", genre: "Computer Science" },
  { id: 5, title: "Data Structures and Algorithms", author: "Narasimha Karumanchi", available: false, dueDate: "2025-07-05", shelf: "C-09", genre: "Computer Science" },
  { id: 6, title: "Operating System Concepts", author: "Silberschatz", available: true, shelf: "D-01", genre: "Systems" },
  { id: 7, title: "Computer Networks", author: "Andrew Tanenbaum", available: true, shelf: "D-04", genre: "Networks" },
  { id: 8, title: "Database System Concepts", author: "Korth & Silberschatz", available: false, dueDate: "2025-07-15", shelf: "E-02", genre: "Databases" },
  { id: 9, title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", available: true, shelf: "F-01", genre: "AI/ML" },
  { id: 10, title: "Machine Learning", author: "Tom Mitchell", available: true, shelf: "F-03", genre: "AI/ML" },
  { id: 11, title: "Deep Learning", author: "Ian Goodfellow", available: false, dueDate: "2025-07-20", shelf: "F-05", genre: "AI/ML" },
  { id: 12, title: "Engineering Mathematics", author: "B.S. Grewal", available: true, shelf: "G-08", genre: "Mathematics" },
  { id: 13, title: "Discrete Mathematics", author: "Kenneth Rosen", available: true, shelf: "G-11", genre: "Mathematics" },
  { id: 14, title: "Software Engineering", author: "Ian Sommerville", available: false, dueDate: "2025-07-08", shelf: "H-02", genre: "Software Engineering" },
  { id: 15, title: "The Art of Computer Programming", author: "Donald Knuth", available: true, shelf: "A-01", genre: "Computer Science" }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'library', timestamp: new Date().toISOString() });
});

// Search endpoint
app.get('/search', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.json({
      source: 'library',
      query: '',
      totalResults: libraryBooks.length,
      availableCount: libraryBooks.filter(b => b.available).length,
      results: libraryBooks.slice(0, 5)
    });
  }

  const searchTerm = query.toLowerCase();
  const results = libraryBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.genre.toLowerCase().includes(searchTerm)
  );

  const availableCount = libraryBooks.filter(b => b.available).length;

  res.json({
    source: 'library',
    query,
    totalResults: results.length,
    availableCount,
    results: results.length > 0 ? results : libraryBooks.slice(0, 3),
    message: results.length === 0 ? `No books found matching "${query}". Showing popular books instead.` : null
  });
});

app.listen(PORT, () => {
  console.log(`📚 Library MCP Server running on http://localhost:${PORT}`);
});
