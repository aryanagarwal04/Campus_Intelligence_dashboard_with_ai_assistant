import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      authenticated: true, 
      user: { email: payload.email, role: payload.role, branch: payload.branch } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 500 });
  }
}
