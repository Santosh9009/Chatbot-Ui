# AI Chatbot Frontend

A modern, dark-themed chatbot interface built with Next.js that connects to a Python FastAPI backend powered by Google Gemini AI.

## 🚀 Live Deployment

- **Frontend**: https://chatbot-lime-xi.vercel.app/
- **Backend API**: https://intern-2025-q10-production.up.railway.app

## Features

- 🎨 **Dark theme UI** with modern design using shadcn/ui components
- 💬 **Real-time chat** with AI assistant
- 📊 **Live statistics** showing total messages, tokens used, and cache hit rate
- 🧠 **Conversation memory** - AI remembers context from previous messages
- ⚡ **Caching support** - Fast responses for repeated queries
- 📜 **Chat history** - Load and view previous conversations
- 🔄 **Real-time updates** - Connection status and error handling
- 📱 **Responsive design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript

## Prerequisites

Make sure you have the Python backend running first:

1. Navigate to the Python backend directory (`intern-2025-q10`)
2. Install Python dependencies: `pip install -r requirements.txt`
3. Set up your `.env` file with your Gemini API key
4. Start the backend server: `python -m src.main api 8000`

The backend should be running on `http://127.0.0.1:8000`

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` if your backend is running on a different URL:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

## Usage

### Main Features

- **Send messages**: Type in the input field and press Enter or click Send
- **View statistics**: Real-time stats in the left sidebar showing:
  - Total messages exchanged
  - Total tokens used
  - Cache hit rate percentage
  - Number of cached responses
- **Load history**: Click "Load History" to fetch previous conversations
- **Clear chat**: Clear current conversation (local only)
- **Clear history**: Clear all chat history from the database

### UI Elements

- **Connection indicator**: Green/red dot next to the title shows backend status
- **Message indicators**: Shows timestamp, token count, cache status, and model used
- **Cached responses**: Messages served from cache show a "Cached" badge with lightning icon
- **Error handling**: Clear error messages for rate limits, connection issues, etc.

### Keyboard Shortcuts

- **Enter**: Send message
- **Escape**: Clear current input

## API Integration

The frontend communicates with the Python backend via REST API:

- `POST /chat` - Send messages to the AI
- `GET /history` - Retrieve chat history
- `GET /stats` - Get database statistics
- `DELETE /history` - Clear chat history
- `GET /health` - Check backend status

## Backend Features Supported

- ✅ **Rate limiting** - Shows appropriate error when limit exceeded
- ✅ **Caching** - Displays cache status for each message
- ✅ **Conversation memory** - AI maintains context across messages
- ✅ **Token tracking** - Shows token usage for cost monitoring
- ✅ **Database persistence** - All conversations are saved
- ✅ **Multiple models** - Supports different Gemini model variants

## Development

### Project Structure

```
src/
├── app/
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with dark theme
│   └── page.tsx           # Main page component
├── components/
│   ├── ui/               # shadcn/ui components
│   └── Chatbot.tsx       # Main chatbot component
├── hooks/
│   └── useChat.ts        # Chat state management hook
└── lib/
    ├── api.ts            # API client and types
    └── utils.ts          # Utility functions
```

### Building

```bash
npm run build
```

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Update environment variables for production backend URL

## Troubleshooting

### Backend Connection Issues

If you see "Backend Offline" in the sidebar:

1. Ensure the Python backend is running on port 8000
2. Check the backend URL in `.env.local`
3. Verify CORS is configured correctly in the backend
4. Check browser console for specific error messages

### Rate Limiting

If you encounter rate limit errors:
- The backend limits requests to 10 per minute
- Wait for the rate limit to reset
- The error message will indicate when you can try again

### Development Issues

- **Hot reload not working**: Restart the dev server
- **Styles not applying**: Check Tailwind CSS configuration
- **TypeScript errors**: Run `npm run build` to check for type issues

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
