import { NextRequest, NextResponse } from 'next/server';

// In a real application, you would validate against a database
// For demo purposes, we'll use a hardcoded PIN
const VALID_PINS = {
  '1234': 'demo-api-key-1234',
  '5678': 'demo-api-key-5678',
  '9999': 'demo-api-key-9999'
};

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { error: 'PIN inválido' },
        { status: 400 }
      );
    }

    // Validate PIN
    const apiKey = VALID_PINS[pin as keyof typeof VALID_PINS];
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'PIN incorreto' },
        { status: 401 }
      );
    }

    // Return success with API key
    return NextResponse.json({
      success: true,
      apiKey,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}