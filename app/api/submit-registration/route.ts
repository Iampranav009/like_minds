import { NextResponse } from 'next/server';
import { appendToSheet, initializeSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    // Parse form data
    const data = await req.json();
    const { name, number, gender, branch, interests } = data;

    // Validate required fields
    if (!name || !number || !gender || !branch || !interests) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Initialize the sheet (creates headers if needed)
    await initializeSheet();

    // Append data to the sheet
    const success = await appendToSheet({ name, number, gender, branch, interests });

    if (success) {
      return NextResponse.json(
        { success: true, message: 'Registration submitted successfully' },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit registration' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error in registration form submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 