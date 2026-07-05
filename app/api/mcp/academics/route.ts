import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Academic from '@/models/Academic';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let dbQuery = {};
    if (type) {
      dbQuery = { type: { $regex: new RegExp(`^${type}$`, 'i') } };
    }

    const academics = await Academic.find(dbQuery).lean();
    return NextResponse.json({ success: true, data: academics });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body.type || !body.title || !body.details) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newAcademic = await Academic.create(body);
    return NextResponse.json({ success: true, data: newAcademic }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create academic record' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ success: false, error: 'Missing academic record _id' }, { status: 400 });
    }

    const updatedAcademic = await Academic.findByIdAndUpdate(body._id, body, { new: true, runValidators: true });
    if (!updatedAcademic) {
      return NextResponse.json({ success: false, error: 'Academic record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAcademic });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update academic record' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing academic record id parameter' }, { status: 400 });
    }

    const deletedAcademic = await Academic.findByIdAndDelete(id);
    if (!deletedAcademic) {
      return NextResponse.json({ success: false, error: 'Academic record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete academic record' }, { status: 500 });
  }
}
