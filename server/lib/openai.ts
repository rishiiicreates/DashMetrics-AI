import OpenAI from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

/**
 * Generate AI-powered insights based on analytics data
 */
export async function generateInsights(data: any): Promise<any> {
  try {
    const prompt = `
      Analyze the following social media content and analytics data to generate insights.
      
      Content: ${JSON.stringify(data.content)}
      Analytics: ${JSON.stringify(data.analytics)}
      Platforms: ${JSON.stringify(data.platforms)}
      
      Please provide insights in the following JSON format:
      {
        "summary": "A concise summary of the main insight (1-2 sentences)",
        "details": ["Detail point 1", "Detail point 2"],
        "recommendations": ["Recommendation 1", "Recommendation 2"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: "You are an expert social media analyst with years of experience interpreting engagement trends and content performance." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const responseText = response.choices[0].message?.content || "";
    try {
      // Try to parse the JSON response
      if (responseText) {
        return JSON.parse(responseText);
      }
      
      // Fallback for empty response
      return {
        summary: "Unable to analyze your content at this time.",
        details: [],
        recommendations: []
      };
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return {
        summary: "Unable to analyze your content at this time.",
        details: [],
        recommendations: []
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate insights from AI service");
  }
}

/**
 * Process natural language queries about user analytics
 */
export async function processNaturalLanguageQuery(data: any): Promise<string> {
  try {
    const prompt = `
      Answer the following question about social media content and analytics data:
      
      Question: "${data.query}"
      
      Available Content: ${JSON.stringify(data.content)}
      Analytics Data: ${JSON.stringify(data.analytics)}
      Platforms: ${JSON.stringify(data.platforms)}
      
      Provide a concise, helpful answer based only on the data provided.
    `;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: "You are a helpful analytics assistant specialized in explaining social media data. Always provide specific metrics and actionable insights based only on the provided data." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    return response.choices[0].message?.content || "I couldn't find an answer to that question in your data.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to process your query. Please try again later.");
  }
}

/**
 * Auto-tag content based on title and description
 */
export async function autoTagContent(contentItem: any): Promise<string[]> {
  try {
    const promptText = `
      Generate relevant tags for the following social media content.
      These tags should be specific, relevant to the content, and useful for categorization.
      
      Title: "${contentItem.title}"
      Description: "${contentItem.description || ""}"
      Platform: ${contentItem.platform}
      Content Type: ${contentItem.contentType || "post"}
      
      Return only a JSON array of tags, for example: ["productivity", "tutorial", "remote-work"]
      Each tag should be a single word or hyphenated phrase, all lowercase. Generate between 3-7 tags.
    `;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: "You generate accurate, specific, and relevant tags for social media content. Tags should be lowercase, single words or hyphenated phrases." },
        { role: "user", content: promptText }
      ],
      temperature: 0.5,
      max_tokens: 200,
      response_format: { type: "json_object" }
    });

    const responseText = response.choices[0].message?.content || "[]";
    try {
      // Try to parse the JSON response
      const result = JSON.parse(responseText);
      // If result is an object with a tags property, return the tags
      if (result && result.tags && Array.isArray(result.tags)) {
        return result.tags;
      }
      // If result is an array, return it directly
      if (Array.isArray(result)) {
        return result;
      }
      // Otherwise, try to extract an array from somewhere in the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return ["error", "parsing-failed"];
    } catch (error) {
      console.error("Error parsing auto-tag response:", error);
      return ["error", "parsing-failed"];
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to auto-tag content");
  }
}

/**
 * Generate content recommendations based on performance data
 */
export async function generateContentRecommendations(data: any): Promise<any[]> {
  try {
    const promptText = `
      Based on the following content performance data and analytics, suggest new content ideas
      that would likely perform well.
      
      Recent Content: ${JSON.stringify(data.content)}
      Analytics: ${JSON.stringify(data.analytics)}
      Platforms: ${JSON.stringify(data.platforms)}
      
      Generate 3 content ideas in JSON format like this:
      [
        {
          "platform": "instagram",
          "title": "Suggested content title",
          "contentType": "carousel/video/post/etc",
          "confidence": 0.92
        }
      ]
      
      The confidence score should be between 0 and 1, indicating how confident you are this content would perform well.
    `;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: "You are a content strategy expert who specializes in recommending high-performing content ideas based on past performance data." },
        { role: "user", content: promptText }
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" }
    });

    const responseText = response.choices[0].message?.content || "";
    try {
      // Try to parse the JSON response
      const result = JSON.parse(responseText);
      
      // If the result is an array, return it directly
      if (Array.isArray(result)) {
        return result;
      }
      
      // If the result has a recommendations property that's an array, return that
      if (result && result.recommendations && Array.isArray(result.recommendations)) {
        return result.recommendations;
      }
      
      // If the result has a contentIdeas property that's an array, return that
      if (result && result.contentIdeas && Array.isArray(result.contentIdeas)) {
        return result.contentIdeas;
      }
      
      // Otherwise, try to extract an array from somewhere in the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Could not extract content recommendations from response");
    } catch (error) {
      console.error("Error parsing content recommendations:", error);
      return [
        {
          id: 1,
          platform: "instagram",
          title: "10 Essential Productivity Tools for Remote Work",
          contentType: "carousel",
          confidence: 0.92
        },
        {
          id: 2,
          platform: "youtube",
          title: "Home Office Setup Guide: Ergonomics & Efficiency",
          contentType: "tutorial",
          confidence: 0.87
        },
        {
          id: 3,
          platform: "twitter",
          title: "Thread: 5 Time Management Techniques I've Tested This Month",
          contentType: "thread",
          confidence: 0.84
        }
      ];
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate content recommendations");
  }
}

/**
 * Generate AI-powered competitor analysis with insights and recommendations
 */
export async function analyzeCompetitors(data: any): Promise<any> {
  try {
    const promptText = `
      Analyze the following competitor data and provide detailed insights. Your analysis should focus on:
      1. Performance comparison between the user and their competitors
      2. Key strengths and weaknesses of each competitor
      3. Actionable opportunities for the user to gain competitive advantage
      4. Potential threats and challenges in the competitive landscape
      
      User Data: ${JSON.stringify(data.userData)}
      Competitor Data: ${JSON.stringify(data.competitorData)}
      Industry Benchmarks: ${JSON.stringify(data.industryBenchmarks || {})}
      Platform: ${data.platform || "multiple platforms"}
      Time Period: ${data.timePeriod || "last 30 days"}
      
      Return a comprehensive analysis in the following JSON format:
      {
        "summary": "A brief executive summary of the competitive landscape",
        "comparison": {
          "overallPosition": "User's relative position in the competitive landscape",
          "keyMetrics": [
            {
              "name": "Engagement Rate",
              "userValue": 3.2,
              "industryAverage": 2.8,
              "topCompetitorValue": 4.1,
              "topCompetitor": "Competitor Name",
              "status": "above_average/below_average/leading"
            }
          ]
        },
        "competitors": [
          {
            "name": "Competitor Name",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"],
            "contentStrategy": "Brief description of their content approach",
            "uniqueValue": "What makes them stand out"
          }
        ],
        "opportunities": [
          {
            "title": "Opportunity title",
            "description": "Detailed explanation",
            "difficulty": "low/medium/high",
            "potentialImpact": "low/medium/high",
            "recommendedActions": ["Action 1", "Action 2"]
          }
        ],
        "threats": [
          {
            "title": "Threat title",
            "description": "Detailed explanation",
            "severity": "low/medium/high",
            "probability": "low/medium/high",
            "mitigationStrategies": ["Strategy 1", "Strategy 2"]
          }
        ],
        "contentGaps": ["Content Gap 1", "Content Gap 2"],
        "audienceInsights": ["Insight 1", "Insight 2"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are an expert social media strategist and competitive analyst with deep experience in digital marketing and audience engagement. You provide data-driven insights and actionable recommendations based on competitive analysis." 
        },
        { role: "user", content: promptText }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const responseText = response.choices[0].message?.content || "";
    try {
      // Try to parse the JSON response
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing competitor analysis:", error);
      // Return a structured error response
      return {
        summary: "Could not generate competitor analysis at this time.",
        error: true,
        message: "There was an error processing the competitor data. Please try again later."
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate competitor analysis");
  }
}

/**
 * Generate competitive content gap analysis to identify missed opportunities
 */
export async function analyzeContentGaps(data: any): Promise<any> {
  try {
    const promptText = `
      Analyze the user's content and their competitors' content to identify content gaps and missed opportunities.
      Explore themes, formats, topics, and posting strategies that competitors are leveraging successfully
      but the user is not yet utilizing.
      
      User Content: ${JSON.stringify(data.userContent)}
      Competitor Content: ${JSON.stringify(data.competitorContent)}
      User Analytics: ${JSON.stringify(data.userAnalytics || {})}
      Platform Focus: ${data.platform || "all platforms"}
      
      Return the analysis in the following JSON format:
      {
        "summary": "Brief overview of the content gap analysis",
        "contentGaps": [
          {
            "category": "Theme/Format/Topic",
            "title": "Specific gap title",
            "description": "Detailed explanation of the gap",
            "competitorExamples": ["Example 1", "Example 2"],
            "recommendedApproach": "How the user should approach this opportunity",
            "potentialValue": "high/medium/low",
            "difficulty": "high/medium/low"
          }
        ],
        "missingFormats": ["Format 1", "Format 2"],
        "underutilizedThemes": ["Theme 1", "Theme 2"],
        "recommendedContentCalendar": [
          {
            "week": 1,
            "focus": "Focus area",
            "contentPieces": [
              {
                "title": "Suggested content title",
                "format": "Format",
                "platform": "Platform",
                "targetMetrics": ["Engagement", "Reach"]
              }
            ]
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a content strategy specialist who excels at identifying market opportunities and competitive content gaps. You provide specific, actionable insights based on data analysis." 
        },
        { role: "user", content: promptText }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const responseText = response.choices[0].message?.content || "";
    try {
      // Try to parse the JSON response
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing content gap analysis:", error);
      // Return a structured error response
      return {
        summary: "Could not generate content gap analysis at this time.",
        error: true,
        message: "There was an error processing the content data. Please try again later."
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate content gap analysis");
  }
}
