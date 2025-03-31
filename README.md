# DashMetrics-AI

A modern SAAS analytics dashboard with AI-powered insights for social media performance and competitor analysis.

## Features

- Interactive dashboard with customizable layouts
- AI-powered analytics and insights
- Competitor analysis tools
- Content performance tracking
- User authentication and account management
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Backend**: Express.js
- **Authentication**: Firebase Authentication
- **AI Integration**: OpenAI API
- **Data Visualization**: Recharts
- **State Management**: React Context API
- **Queries**: TanStack Query

## Environment Variables

The following environment variables are required:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
OPENAI_API_KEY=your_openai_api_key
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5000](http://localhost:5000) in your browser

## Deployment

This project can be deployed to Vercel or Render:

### Vercel
1. Connect your GitHub repository
2. Configure the environment variables
3. Deploy

### Render
1. Connect your GitHub repository
2. Use the provided `render.yaml` configuration
3. Configure the environment variables
4. Deploy

## License

MIT