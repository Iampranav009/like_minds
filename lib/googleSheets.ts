import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

// Google Sheets API configuration from environment variables
const SPREADSHEET_ID = '1HLHvAWu_eRERbSkq30UClmK5Jr2TX3XPriurzy9mPlo';
const SHEET_NAME = 'Sheet1';

// Initialize Google Sheets API
async function getAuthClient() {
  try {
    // For production, using the service account credentials from environment variables
    return new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('Error creating auth client:', error);
    throw error;
  }
}

// Initialize the sheets API
async function getSheetsClient() {
  const authClient = await getAuthClient();
  return google.sheets({ 
    version: 'v4', 
    auth: authClient
  });
}

// Set up the header row if it doesn't exist
export async function initializeSheet() {
  try {
    const sheets = await getSheetsClient();
    
    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:E1`,
    });
    
    const headers = response.data.values?.[0];
    
    // If no headers exist, add them
    if (!headers || headers.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:E1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Name', 'Phone Number', 'Gender', 'Branch/Department', 'Interests']],
        },
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing sheet:', error);
    return false;
  }
}

// Append registration data to the Google Sheet
export async function appendToSheet(data: { 
  name: string; 
  number: string; 
  gender: string; 
  branch: string; 
  interests: string 
}) {
  try {
    const sheets = await getSheetsClient();
    
    // Append the row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[data.name, data.number, data.gender, data.branch, data.interests]],
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    return false;
  }
}

// For contact form
export async function appendContactToSheet(data: { name: string; email: string; message: string }) {
  try {
    const sheets = await getSheetsClient();
    
    // Append the row to a separate section or sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Contact!A:C',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[data.name, data.email, data.message]],
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error appending contact to sheet:', error);
    return false;
  }
} 