import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Book from '@/models/Book';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase();

    let dbQuery = {};
    if (query) {
      dbQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      };
    }

    const books = await Book.find(dbQuery).lean();
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Simple validation
    if (!body.title || !body.author || !body.category || !body.availability || !body.shelf) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newBook = await Book.create(body);
    return NextResponse.json({ success: true, data: newBook }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create book' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ success: false, error: 'Missing book _id' }, { status: 400 });
    }

    const updatedBook = await Book.findByIdAndUpdate(body._id, body, { new: true, runValidators: true });
    if (!updatedBook) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedBook });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing book id parameter' }, { status: 400 });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete book' }, { status: 500 });
  }
}
