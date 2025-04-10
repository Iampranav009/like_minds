This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Sheets Integration

This project includes integration with Google Sheets to store user registration data.

### Setup

1. Create a Google Cloud project:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project

2. Enable the Google Sheets API:
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the required information and create the account
   - Click on the service account email to view details
   - Go to the "Keys" tab
   - Add a new key (JSON format)
   - Download the JSON file

4. Set up environment variables:
   - Create a `.env.local` file with the following variables:
     ```
     GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
     GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email
     GOOGLE_PRIVATE_KEY="your-private-key"
     ```
   - Replace the values with your actual credentials

5. Share your Google Sheet:
   - Open your Google Sheet
   - Click "Share" and add your service account email with Editor permissions

### Spreadsheet Structure

The app uses the following structure in the spreadsheet:
- Sheet1: User registrations (Name, Phone Number, Gender, Branch/Department, Interests)
- Contact: Contact form submissions (Name, Email, Message)
