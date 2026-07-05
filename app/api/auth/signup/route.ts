import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

const ADMIN_SECRET = 'admin123'; // Simple passcode to become an admin

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, password, adminPasscode } = body;

    // 1. Validate Email Domain
    if (!email.endsWith('.iitr.ac.in')) {
      return NextResponse.json({ success: false, error: 'Only .iitr.ac.in emails are allowed' }, { status: 400 });
    }

    // 2. Validate Password Length
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    // 3. Extract Branch (e.g., arnav_g@me.iitr.ac.in -> me)
    const domainPart = email.split('@')[1];
    const branchPrefix = domainPart.split('.')[0]; 
    
    const branchMap: Record<string, string> = {
      me: 'Mechanical Engineering',
      cs: 'Computer Science',
      ee: 'Electrical Engineering',
      ce: 'Civil Engineering',
      ec: 'Electronics & Communication',
      ch: 'Chemical Engineering'
    };
    const branch = branchMap[branchPrefix] || 'General Engineering';

    // 4. Role Assignment
    const role = adminPasscode === ADMIN_SECRET ? 'admin' : 'student';

    // 5. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      email,
      passwordHash,
      role,
      branch
    });

    // Generate JWT
    const token = await signToken({ userId: newUser._id, role: newUser.role, email: newUser.email, branch: newUser.branch });

    const response = NextResponse.json({ 
      success: true, 
      message: 'Signup successful',
      user: { email: newUser.email, role: newUser.role, branch: newUser.branch }
    });
    
    // Set HTTPOnly Cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
