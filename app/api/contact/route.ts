import { NextResponse } from 'next/server';
import { appendContactToSheet, initializeSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    // Parse form data
    const data = await req.json();
    const { name, email, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Initialize the sheet (creates headers if needed)
    await initializeSheet();

    // Append data to the sheet
    const success = await appendContactToSheet({ name, email, message });

    if (success) {
      return NextResponse.json(
        { success: true, message: 'Form submitted successfully' },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 