import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // TODO: Connect this to real Firebase Authentication in the future
    // For now, we will create a mock login system to test the CEP plugin connection
    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json(
        { 
          success: true, 
          token: 'mock-jwt-token-12345', 
          message: 'Login successful' 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Bad request' },
      { status: 400 }
    );
  }
}
