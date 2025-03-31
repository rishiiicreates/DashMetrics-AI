// Client-side wrapper for OpenAI API requests
import { queryClient } from './queryClient';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Generate AI-powered insights based on analytics data
export async function generateInsights(data: any) {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: ['/api/ai/generate-insights'],
      queryFn: async () => {
        const res = await fetch('/api/ai/generate-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, model: MODEL })
        });
        
        if (!res.ok) {
          throw new Error('Failed to generate insights');
        }
        
        return res.json();
      }
    });
    
    return response;
  } catch (error: any) {
    console.error('Error generating insights:', error);
    throw new Error(`Failed to generate insights: ${error.message}`);
  }
}

// Process natural language query about analytics data
export async function processNaturalLanguageQuery(query: string) {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: ['/api/ai/search', query],
      queryFn: async () => {
        const res = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, model: MODEL })
        });
        
        if (!res.ok) {
          throw new Error('Failed to process query');
        }
        
        return res.json();
      }
    });
    
    return response;
  } catch (error: any) {
    console.error('Error processing query:', error);
    throw new Error(`Failed to process query: ${error.message}`);
  }
}

// Generate content recommendations based on performance data
export async function generateContentRecommendations() {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: ['/api/ai/content-recommendations'],
      queryFn: async () => {
        const res = await fetch('/api/ai/content-recommendations', {
          method: 'GET'
        });
        
        if (!res.ok) {
          throw new Error('Failed to generate content recommendations');
        }
        
        return res.json();
      }
    });
    
    return response;
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
}

// Auto-tag content based on title, description and other metadata
export async function autoTagContent(content: any) {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: ['/api/ai/auto-tag'],
      queryFn: async () => {
        const res = await fetch('/api/ai/auto-tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, model: MODEL })
        });
        
        if (!res.ok) {
          throw new Error('Failed to auto-tag content');
        }
        
        return res.json();
      }
    });
    
    return response;
  } catch (error: any) {
    console.error('Error auto-tagging content:', error);
    throw new Error(`Failed to auto-tag content: ${error.message}`);
  }
}
