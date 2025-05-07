import { google } from 'googleapis';

// Google Sheets API configuration
const SPREADSHEET_ID = '1HLHvAWu_eRERbSkq30UClmK5Jr2TX3XPriurzy9mPlo';
const SHEET_NAME = 'Sheet1';

// OAuth 2.0 credentials
const CLIENT_ID = '1055067439461-s8rko51l047vc59gj18vof36k2i2gh02.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google';

// Initialize Google Sheets API
async function getAuthClient() {
  try {
    // First try to use OAuth client if we have a refresh token
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
      );
      
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
      
      return oauth2Client;
    }
    
    // Fall back to service account if OAuth isn't configured
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
      range: `${SHEET_NAME}!A1:F1`,
    });
    
    const headers = response.data.values?.[0];
    
    // If no headers exist, add them
    if (!headers || headers.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:F1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Name', 'Phone Number', 'Gender', 'Branch/Department', 'Interests', 'Score']],
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
  interests: string;
  score?: string;
}) {
  try {
    const sheets = await getSheetsClient();
    
    // Append the row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          data.name, 
          data.number, 
          data.gender, 
          data.branch, 
          data.interests,
          data.score || ''
        ]],
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

// Get OAuth URL for authorization
export function getOAuthUrl() {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
    prompt: 'consent'
  });
}

// Exchange code for tokens
export async function getTokens(code: string) {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
} 