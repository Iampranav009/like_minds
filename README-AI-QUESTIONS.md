# AI-Generated Quiz Questions

This feature allows your application to generate unique quiz questions for each user using Google's Gemini AI model. Questions follow the same format as your static questions but are dynamically created.

## Setup Instructions

1. **Get a Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for the next step

2. **Configure Environment Variables**:
   - Create a `.env.local` file in the root of your project
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. **Install Dependencies**:
   - We've already installed the required package:
     ```
     npm install @google/generative-ai
     ```

## Using the Dynamic Questions

### In Your Components

The `useGeneratedQuestions` hook provides an easy way to fetch AI-generated questions:

```tsx
import { useGeneratedQuestions } from '../hooks/useGeneratedQuestions';

function YourQuizComponent() {
  // Optional parameters for personalization
  const userId = 'user123';
  const categories = ['programming', 'leadership'];
  
  const { questions, loading, error } = useGeneratedQuestions(userId, categories);
  
  // Use the questions in your UI
  // ...
}
```

### API Endpoint

You can also directly call the API endpoint:

```js
const response = await fetch('/api/generate-questions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user123',
    categories: ['programming', 'leadership'],
  }),
});

const data = await response.json();
const generatedQuestions = data.questions;
```

## Customize Question Generation

To modify the types of questions generated, edit the prompt in `app/api/generate-questions/route.ts`.

## Fallback Mechanism

If AI generation fails, the system will automatically fall back to using random questions from your static `questions.json` file.

## Demo Component

Try out the `DynamicQuiz` component to see AI-generated questions in action:

```tsx
import DynamicQuiz from '@/app/components/DynamicQuiz';

export default function YourPage() {
  return (
    <div>
      <h1>AI-Generated Quiz</h1>
      <DynamicQuiz />
    </div>
  );
}
``` 