import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ 
        authenticated: false 
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      authenticated: true,
      user: session.user
    }, { status: 200 });
  } catch (error) {
    console.error('Error validating session:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Error validating session'
    }, { status: 500 });
  }
} 