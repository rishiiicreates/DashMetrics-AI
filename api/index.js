import express from 'express';
import { createServer } from 'http';

const app = express();
app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Simple health check endpoint for Vercel
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'DashMetrics-AI API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Create server for local development
if (process.env.NODE_ENV !== 'production') {
  const server = createServer(app);
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
export default app;