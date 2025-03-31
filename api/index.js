// Simple serverless function for Vercel deployment
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Simple health check response
  return res.status(200).json({ 
    status: 'ok', 
    message: 'DashMetrics-AI API is running',
    timestamp: new Date().toISOString()
  });
}