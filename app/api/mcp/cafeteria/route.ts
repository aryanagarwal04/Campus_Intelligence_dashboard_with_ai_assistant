import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');

    let dbQuery = {};
    if (day) {
      // Basic case-insensitive search for the day
      dbQuery = { day: { $regex: new RegExp(`^${day}$`, 'i') } };
    }

    const menu = await MenuItem.find(dbQuery).lean();
    return NextResponse.json({ success: true, data: menu });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body.day || !body.meal || !body.items || !body.timing) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newMenuItem = await MenuItem.create(body);
    return NextResponse.json({ success: true, data: newMenuItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ success: false, error: 'Missing menu item _id' }, { status: 400 });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(body._id, body, { new: true, runValidators: true });
    if (!updatedMenuItem) {
      return NextResponse.json({ success: false, error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMenuItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing menu item id parameter' }, { status: 400 });
    }

    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return NextResponse.json({ success: false, error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete menu item' }, { status: 500 });
  }
}
