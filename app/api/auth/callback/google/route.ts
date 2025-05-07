import { NextResponse } from 'next/server';
import { getTokens } from '@/lib/googleSheets';

export async function GET(request: Request) {
  // Get the code from the URL
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }
  
  try {
    // Exchange the code for tokens
    const tokens = await getTokens(code);
    
    // This is where you would normally store the refresh token in your database
    // For this demo, we're just returning it
    // In production, you should NEVER expose tokens in the response
    
    console.log('Obtained refresh token:', tokens.refresh_token);
    
    // Redirect to a success page
    return NextResponse.redirect(new URL('/auth-success', request.url));
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json({ error: 'Failed to get authorization tokens' }, { status: 500 });
  }
} 