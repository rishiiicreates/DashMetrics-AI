# DashMetrics-AI

DashMetrics-AI is a full-stack SAAS application that helps content creators and social media managers track, analyze, and optimize their social media performance with AI-powered insights.

## Features

- **Multi-platform Analytics Dashboard**: View and analyze performance metrics across different social media platforms
- **AI-Powered Insights**: Leverage OpenAI to generate content recommendations and performance insights
- **Customizable Dashboard**: Create personalized layouts for monitoring your most important metrics
- **Content Calendar**: Plan and schedule content across multiple platforms
- **Competitor Analysis**: Track and analyze competitor performance
- **Authentication**: Secure user authentication with email/password and social login options

## Tech Stack

- **Frontend**: React, Shadcn/UI, TailwindCSS, Vite
- **Backend**: Express.js
- **Authentication**: Firebase Auth, Passport.js
- **AI Integration**: OpenAI API
- **Storage**: In-memory storage (for demo purposes)

## Prerequisites

Before deploying the application, you'll need to:

1. Create a Firebase project and set up Firebase Authentication
2. Set up an OpenAI API account and get an API key
3. Set up accounts on deployment platforms (Vercel or Render)

## Environment Variables

The application requires the following environment variables:

```
OPENAI_API_KEY=your_openai_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with the environment variables listed above
4. Start the development server with `npm run dev`
5. Open your browser to the URL shown in the terminal

## Deployment

### Deploying to Vercel

1. Fork/clone this repository to your GitHub account
2. Sign up for Vercel (https://vercel.com) if you haven't already
3. Create a new project and import your GitHub repository
4. Configure the following environment variables in Vercel's dashboard:
   - `OPENAI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_PROJECT_ID`
5. Deploy the application by clicking "Deploy"

### Deploying to Render

1. Fork/clone this repository to your GitHub account
2. Sign up for Render (https://render.com) if you haven't already
3. Create a new Web Service and import your GitHub repository
4. Use the settings from the `render.yaml` file
5. Add the environment variables listed above
6. Deploy the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [your support email].