import { NextRequest, NextResponse } from 'next/server';

// In a real application, this would get the API key from the authenticated user's profile
// For demo purposes, we'll return a hardcoded key or get it from a simple storage

export async function GET(request: NextRequest) {
  try {
    // In production, you would:
    // 1. Get the authenticated user from session/JWT
    // 2. Get their DeepSeek API key from the database
    // 3. Return it securely
    
    // For demo purposes, we'll check if there's a configured key
    const demoApiKey = 'sk-demo-deepseek-key-for-testing-purposes';
    
    return NextResponse.json({
      apiKey: demoApiKey,
      configured: true,
      message: 'Demo API key retrieved successfully'
    });

  } catch (error) {
    console.error('Error retrieving DeepSeek API key:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve API key' },
      { status: 500 }
    );
  }
}