import mongoose from 'mongoose';
import Book from '../models/Book';
import MenuItem from '../models/MenuItem';
import Event from '../models/Event';
import Academic from '../models/Academic';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Book.deleteMany({}),
      MenuItem.deleteMany({}),
      Event.deleteMany({}),
      Academic.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Seed Books
    await Book.create([
      { title: 'Clean Code', author: 'Robert C. Martin', category: 'Computer Science', availability: 'Available', shelf: 'CS-101', isbn: '978-0132350884' },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', availability: 'Checked Out', shelf: 'CS-102', isbn: '978-0262033848' },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Software Engineering', availability: 'Available', shelf: 'SE-201', isbn: '978-0135957059' }
    ]);
    console.log('Seeded Books');

    // Seed Cafeteria Menu
    await MenuItem.create([
      { day: 'Monday', meal: 'Breakfast', items: ['Poha', 'Jalebi', 'Tea', 'Coffee'], timing: '7:30 AM - 9:30 AM' },
      { day: 'Monday', meal: 'Lunch', items: ['Rajma Chawal', 'Roti', 'Salad', 'Curd'], timing: '12:30 PM - 2:30 PM' },
      { day: 'Monday', meal: 'Dinner', items: ['Paneer Butter Masala', 'Naan', 'Dal Tadka', 'Gulab Jamun'], timing: '7:30 PM - 9:30 PM' },
      { day: 'Tuesday', meal: 'Lunch', items: ['Chole Bhature', 'Lassi', 'Onion Salad'], timing: '12:30 PM - 2:30 PM' }
    ]);
    console.log('Seeded Cafeteria Menu');

    // Seed Events
    await Event.create([
      { name: 'HackCampus 2026', category: 'Tech', date: new Date('2026-06-20T09:00:00Z'), venue: 'Main Auditorium', organizer: 'Tech Club' },
      { name: 'Cultural Night', category: 'Cultural', date: new Date('2026-06-25T18:00:00Z'), venue: 'Open Air Theatre', organizer: 'Cultural Committee' },
      { name: 'AI Workshop', category: 'Workshop', date: new Date('2026-07-02T10:00:00Z'), venue: 'CS Lab 3', organizer: 'AI/ML Society' }
    ]);
    console.log('Seeded Events');

    // Seed Academics
    await Academic.create([
      { type: 'Exam', title: 'Mid-Semester Examinations', date: new Date('2026-09-15T00:00:00Z'), details: 'Covers syllabus from weeks 1-6.', department: 'All' },
      { type: 'Holiday', title: 'Diwali Break', date: new Date('2026-11-08T00:00:00Z'), details: 'Campus closed for 5 days.', department: 'All' },
      { type: 'Faculty', title: 'Dr. Ramesh Kumar', details: 'Professor of Computer Science. Office hours: Tue/Thu 2-4 PM.', department: 'Computer Science' }
    ]);
    console.log('Seeded Academics');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
