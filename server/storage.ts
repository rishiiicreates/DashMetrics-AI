import { 
  users, type User, type InsertUser,
  socialAccounts, type SocialAccount, type InsertSocialAccount,
  contentItems, type ContentItem, type InsertContentItem,
  analytics, type Analytics, type InsertAnalytics,
  dashboardLayouts, type DashboardLayout, type InsertDashboardLayout,
  aiInsights, type AiInsight, type InsertAiInsight
} from "@shared/schema";
import { 
  generateInsights, 
  processNaturalLanguageQuery, 
  generateContentRecommendations, 
  autoTagContent,
  analyzeCompetitors,
  analyzeContentGaps
} from "./lib/openai";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByProviderId(provider: string, providerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Social account methods
  getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]>;
  getSocialAccount(id: number): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, accountData: Partial<SocialAccount>): Promise<SocialAccount | undefined>;
  disconnectSocialAccount(id: number): Promise<void>;
  
  // Content item methods
  getContentItemsBySocialAccountId(socialAccountId: number): Promise<ContentItem[]>;
  getContentItem(id: number): Promise<ContentItem | undefined>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, itemData: Partial<ContentItem>): Promise<ContentItem | undefined>;
  getTopPerformingContent(userId: number, limit?: number): Promise<ContentItem[]>;
  getContentItemsByTag(userId: number, tag: string): Promise<ContentItem[]>;
  
  // Analytics methods
  getAnalyticsByUserId(userId: number): Promise<Analytics[]>;
  getAnalyticsBySocialAccountId(socialAccountId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsSummary(userId: number): Promise<any>;
  getPerformanceData(userId: number, timeframe: string): Promise<any>;
  getHeatmapData(userId: number): Promise<any>;
  getAudienceData(userId: number): Promise<any>;
  getCompetitorData(userId: number): Promise<any>;
  addCompetitor(userId: number, competitorData: any): Promise<any>;
  removeCompetitor(userId: number, competitorId: number): Promise<void>;
  
  // Dashboard layout methods
  getDashboardLayoutsByUserId(userId: number): Promise<DashboardLayout[]>;
  getDashboardLayoutById(id: number): Promise<DashboardLayout | undefined>;
  createDashboardLayout(layout: InsertDashboardLayout): Promise<DashboardLayout>;
  updateDashboardLayout(id: number, layoutData: Partial<DashboardLayout>): Promise<DashboardLayout | undefined>;
  deleteDashboardLayout(id: number): Promise<void>;
  
  // AI insights methods
  getAIInsightsByUserId(userId: number): Promise<AiInsight[]>;
  createAIInsight(insight: InsertAiInsight): Promise<AiInsight>;
  generateAIInsights(userId: number, data?: any): Promise<any>;
  processNaturalLanguageQuery(userId: number, query: string): Promise<any>;
  autoTagContent(contentId: number): Promise<string[]>;
  generateContentRecommendations(userId: number): Promise<any>;
  analyzeCompetitors(data: any): Promise<any>;
  analyzeContentGaps(data: any): Promise<any>;
  getContentItemsByUserId(userId: number): Promise<ContentItem[]>;
  getContentItemsByCompetitorId(competitorId: number): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private socialAccounts: Map<number, SocialAccount>;
  private contentItems: Map<number, ContentItem>;
  private analyticsItems: Map<number, Analytics>;
  private dashboardLayouts: Map<number, DashboardLayout>;
  private aiInsightsItems: Map<number, AiInsight>;
  
  private userIdCounter: number;
  private socialAccountIdCounter: number;
  private contentItemIdCounter: number;
  private analyticsItemIdCounter: number;
  private dashboardLayoutIdCounter: number;
  private aiInsightIdCounter: number;

  constructor() {
    this.users = new Map();
    this.socialAccounts = new Map();
    this.contentItems = new Map();
    this.analyticsItems = new Map();
    this.dashboardLayouts = new Map();
    this.aiInsightsItems = new Map();
    
    this.userIdCounter = 1;
    this.socialAccountIdCounter = 1;
    this.contentItemIdCounter = 1;
    this.analyticsItemIdCounter = 1;
    this.dashboardLayoutIdCounter = 1;
    this.aiInsightIdCounter = 1;
    
    // Add seed data for development
    this.seedData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByProviderId(provider: string, providerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.provider === provider && user.providerId === providerId,
    );
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...userData, 
      id,
      createdAt: now,
      lastLogin: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Social account methods
  async getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values()).filter(
      (account) => account.userId === userId,
    );
  }
  
  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    return this.socialAccounts.get(id);
  }
  
  async createSocialAccount(accountData: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.socialAccountIdCounter++;
    const now = new Date();
    const account: SocialAccount = { 
      ...accountData, 
      id,
      createdAt: now,
      updatedAt: now,
      isConnected: true
    };
    this.socialAccounts.set(id, account);
    return account;
  }
  
  async updateSocialAccount(id: number, accountData: Partial<SocialAccount>): Promise<SocialAccount | undefined> {
    const account = this.socialAccounts.get(id);
    if (!account) return undefined;
    
    const updatedAccount = { 
      ...account, 
      ...accountData,
      updatedAt: new Date()
    };
    this.socialAccounts.set(id, updatedAccount);
    return updatedAccount;
  }
  
  async disconnectSocialAccount(id: number): Promise<void> {
    const account = this.socialAccounts.get(id);
    if (!account) return;
    
    account.isConnected = false;
    account.updatedAt = new Date();
    this.socialAccounts.set(id, account);
  }
  
  // Content item methods
  async getContentItemsBySocialAccountId(socialAccountId: number): Promise<ContentItem[]> {
    return Array.from(this.contentItems.values()).filter(
      (item) => item.socialAccountId === socialAccountId,
    );
  }
  
  async getContentItem(id: number): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }
  
  async createContentItem(itemData: InsertContentItem): Promise<ContentItem> {
    const id = this.contentItemIdCounter++;
    const now = new Date();
    const item: ContentItem = { 
      ...itemData, 
      id,
      createdAt: now,
      updatedAt: now,
      isBookmarked: false
    };
    this.contentItems.set(id, item);
    return item;
  }
  
  async updateContentItem(id: number, itemData: Partial<ContentItem>): Promise<ContentItem | undefined> {
    const item = this.contentItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { 
      ...item, 
      ...itemData,
      updatedAt: new Date()
    };
    this.contentItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async getTopPerformingContent(userId: number, limit: number = 4): Promise<ContentItem[]> {
    // Get all social accounts for the user
    const userAccounts = await this.getSocialAccountsByUserId(userId);
    const accountIds = userAccounts.map(account => account.id);
    
    // Get all content items for those accounts
    const userContent = Array.from(this.contentItems.values()).filter(
      item => accountIds.includes(item.socialAccountId)
    );
    
    // Sort by engagement (could use a more sophisticated algorithm in a real app)
    return userContent
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, limit);
  }
  
  async getContentItemsByTag(userId: number, tag: string): Promise<ContentItem[]> {
    // Get all social accounts for the user
    const userAccounts = await this.getSocialAccountsByUserId(userId);
    const accountIds = userAccounts.map(account => account.id);
    
    // Get all content items for those accounts with the specified tag
    return Array.from(this.contentItems.values()).filter(
      item => accountIds.includes(item.socialAccountId) && 
              item.tags && 
              item.tags.includes(tag)
    );
  }
  
  // Analytics methods
  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return Array.from(this.analyticsItems.values()).filter(
      (item) => item.userId === userId,
    );
  }
  
  async getAnalyticsBySocialAccountId(socialAccountId: number): Promise<Analytics[]> {
    return Array.from(this.analyticsItems.values()).filter(
      (item) => item.socialAccountId === socialAccountId,
    );
  }
  
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsItemIdCounter++;
    const now = new Date();
    const item: Analytics = { 
      ...analyticsData, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.analyticsItems.set(id, item);
    return item;
  }
  
  async getAnalyticsSummary(userId: number): Promise<any> {
    // In a real app, this would compute actual statistics from analytics data
    return {
      followers: { value: "158.4K", change: 8.2 },
      engagement: { value: "4.7%", change: -0.8 },
      views: { value: "2.3M", change: 12.4 },
      contentCount: { value: "78", change: 4 }
    };
  }
  
  async getPerformanceData(userId: number, timeframe: string): Promise<any> {
    // Generate sample performance data based on the timeframe
    let labels: string[];
    switch (timeframe) {
      case "30days":
        labels = ["Day 1", "Day 7", "Day 14", "Day 21", "Day 30"];
        break;
      case "quarter":
        labels = ["Jan", "Feb", "Mar"];
        break;
      case "ytd":
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        break;
      default:
        labels = ["Day 1", "Day 7", "Day 14", "Day 21", "Day 30"];
    }
    
    return {
      data: labels.map((label, index) => ({
        date: label,
        youtube: Math.floor(1000 + Math.random() * 4000),
        instagram: Math.floor(500 + Math.random() * 3500),
        twitter: Math.floor(200 + Math.random() * 2500)
      }))
    };
  }
  
  async getHeatmapData(userId: number): Promise<any> {
    // Generate heatmap data for engagement by day and time
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const times = ["9AM", "12PM", "3PM", "6PM", "9PM"];
    const cells = [];
    
    for (let dayIndex = 0; dayIndex < weekdays.length; dayIndex++) {
      for (let timeIndex = 0; timeIndex < 8; timeIndex++) {
        // Create some patterns - higher engagement in evenings and midweek
        let value = Math.floor(Math.random() * 5);
        
        // Boost midweek evening values
        if (dayIndex >= 2 && dayIndex <= 4 && timeIndex >= 4 && timeIndex <= 5) {
          value = Math.min(4, value + 2);
        }
        
        cells.push({
          day: weekdays[dayIndex],
          time: String(timeIndex),
          value
        });
      }
    }
    
    return {
      weekdays,
      times,
      cells,
      bestTime: {
        day: "Wednesday",
        time: "5PM"
      }
    };
  }
  
  async getAudienceData(userId: number): Promise<any> {
    // Return audience demographics data
    return {
      ageGroups: [
        { range: "18-24", percentage: 24 },
        { range: "25-34", percentage: 42 },
        { range: "35-44", percentage: 21 },
        { range: "45-54", percentage: 9 },
        { range: "55+", percentage: 4 }
      ],
      geoDistribution: [
        { country: "United States", percentage: 38 },
        { country: "United Kingdom", percentage: 16 },
        { country: "Canada", percentage: 12 },
        { country: "Australia", percentage: 8 },
        { country: "Germany", percentage: 7 },
        { country: "Other", percentage: 19 }
      ]
    };
  }
  
  async getCompetitorData(userId: number): Promise<any> {
    // Return competitor analysis data
    return {
      competitors: [
        { id: 1, name: "Your Brand", engagementRate: 4.7, barHeight: 44, color: "#6200EA" },
        { id: 2, name: "Competitor A", engagementRate: 3.9, barHeight: 36, color: "#FF9100" },
        { id: 3, name: "Competitor B", engagementRate: 3.1, barHeight: 28, color: "#00BFA5" },
        { id: 4, name: "Competitor C", engagementRate: 5.2, barHeight: 52, color: "#FF4081" }
      ],
      insights: [
        {
          id: 1,
          title: "Content Frequency",
          description: "Competitor C posts 3x more frequently than you on Instagram, which may explain their higher engagement rate.",
          icon: "zap"
        },
        {
          id: 2,
          title: "Content Formats",
          description: "Your video content outperforms competitors, but they lead in carousel posts with 2.1x higher engagement.",
          icon: "target"
        }
      ]
    };
  }
  
  async addCompetitor(userId: number, competitorData: any): Promise<any> {
    // In a real app, would add the competitor to a database
    // For demo purposes, just return a sample competitor entry
    return {
      id: Date.now(),
      name: competitorData.handle || "New Competitor",
      engagementRate: (Math.random() * 5).toFixed(1),
      barHeight: Math.floor(Math.random() * 50) + 20,
      color: "#" + Math.floor(Math.random()*16777215).toString(16)
    };
  }
  
  async removeCompetitor(userId: number, competitorId: number): Promise<void> {
    // In a real app, would remove the competitor from a database
    // No action needed for demo
  }
  
  // Dashboard layout methods
  async getDashboardLayoutsByUserId(userId: number): Promise<DashboardLayout[]> {
    return Array.from(this.dashboardLayouts.values()).filter(
      (layout) => layout.userId === userId,
    );
  }
  
  async getDashboardLayoutById(id: number): Promise<DashboardLayout | undefined> {
    return this.dashboardLayouts.get(id);
  }
  
  async createDashboardLayout(layoutData: InsertDashboardLayout): Promise<DashboardLayout> {
    const id = this.dashboardLayoutIdCounter++;
    const now = new Date();
    const layout: DashboardLayout = { 
      ...layoutData, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.dashboardLayouts.set(id, layout);
    return layout;
  }
  
  async updateDashboardLayout(id: number, layoutData: Partial<DashboardLayout>): Promise<DashboardLayout | undefined> {
    const layout = this.dashboardLayouts.get(id);
    if (!layout) return undefined;
    
    const updatedLayout = { 
      ...layout, 
      ...layoutData,
      updatedAt: new Date()
    };
    this.dashboardLayouts.set(id, updatedLayout);
    return updatedLayout;
  }
  
  async deleteDashboardLayout(id: number): Promise<void> {
    this.dashboardLayouts.delete(id);
  }
  
  // AI insights methods
  async getAIInsightsByUserId(userId: number): Promise<AiInsight[]> {
    return Array.from(this.aiInsightsItems.values()).filter(
      (insight) => insight.userId === userId,
    );
  }
  
  async createAIInsight(insightData: InsertAiInsight): Promise<AiInsight> {
    const id = this.aiInsightIdCounter++;
    const now = new Date();
    const insight: AiInsight = { 
      ...insightData, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.aiInsightsItems.set(id, insight);
    return insight;
  }
  
  async generateAIInsights(userId: number): Promise<any> {
    try {
      // Get user content and analytics to analyze
      const userAccounts = await this.getSocialAccountsByUserId(userId);
      const accountIds = userAccounts.map(account => account.id);
      
      // Get recent content items
      const recentContent = Array.from(this.contentItems.values())
        .filter(item => accountIds.includes(item.socialAccountId))
        .sort((a, b) => {
          const dateA = a.publishedAt || a.createdAt;
          const dateB = b.publishedAt || b.createdAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, 20);
      
      // Get analytics data
      const analyticsData = await this.getAnalyticsSummary(userId);
      
      // Use OpenAI to generate insights
      const data = {
        content: recentContent,
        analytics: analyticsData,
        platforms: userAccounts.map(a => a.platform)
      };
      
      // Generate insights using OpenAI
      const insights = await generateInsights(data);
      
      // Store the generated insights
      const insightRecord = await this.createAIInsight({
        userId,
        socialAccountId: userAccounts[0]?.id, // Use the first account or null
        title: "Content Performance Analysis",
        summary: insights.summary || "Your Instagram content is outperforming your YouTube content by 28% in engagement rate this month.",
        details: insights.details || [
          "Your tutorial-style posts get 2.3x more shares than other content types.",
          "Posts tagged with \"productivity\" have a 32% higher retention rate."
        ],
        recommendations: insights.recommendations || [
          "Schedule Instagram posts on Wednesdays at 6PM",
          "Create more tutorial content for YouTube"
        ],
        metadata: { rawInsights: insights },
      });
      
      // Return the formatted insights for display
      return {
        title: insightRecord.title,
        summary: insightRecord.summary,
        details: insightRecord.details,
        recommendations: [
          {
            id: 1,
            text: insightRecord.recommendations[0] || "Schedule Instagram posts on Wednesdays at 6PM",
            type: "schedule",
            icon: "time"
          },
          {
            id: 2,
            text: insightRecord.recommendations[1] || "Create more tutorial content for YouTube",
            type: "content",
            icon: "edit"
          }
        ]
      };
    } catch (error) {
      console.error("Error generating AI insights:", error);
      // Return fallback data in case of error
      return {
        title: "Analysis Summary",
        summary: "Your Instagram content is outperforming your YouTube content by 28% in engagement rate this month.",
        details: [
          "Your tutorial-style posts get 2.3x more shares than other content types.",
          "Posts tagged with \"productivity\" have a 32% higher retention rate."
        ],
        recommendations: [
          {
            id: 1,
            text: "Schedule Instagram posts on Wednesdays at 6PM",
            type: "schedule",
            icon: "time"
          },
          {
            id: 2,
            text: "Create more tutorial content for YouTube",
            type: "content",
            icon: "edit"
          }
        ]
      };
    }
  }
  
  async processNaturalLanguageQuery(userId: number, query: string): Promise<any> {
    try {
      // Get user data to provide context for the query
      const userAccounts = await this.getSocialAccountsByUserId(userId);
      const accountIds = userAccounts.map(account => account.id);
      
      // Get recent content items and analytics
      const recentContent = Array.from(this.contentItems.values())
        .filter(item => accountIds.includes(item.socialAccountId))
        .slice(0, 50);
      
      const analyticsData = await this.getAnalyticsSummary(userId);
      
      // Use OpenAI to process the query
      const data = {
        query,
        content: recentContent,
        analytics: analyticsData,
        platforms: userAccounts.map(a => a.platform)
      };
      
      // Process query using OpenAI
      const response = await processNaturalLanguageQuery(data);
      return response;
    } catch (error) {
      console.error("Error processing natural language query:", error);
      return "I couldn't find an answer to that question. Please try a different query.";
    }
  }
  
  async autoTagContent(contentId: number): Promise<string[]> {
    try {
      const contentItem = await this.getContentItem(contentId);
      if (!contentItem) {
        throw new Error("Content item not found");
      }
      
      // Use OpenAI to generate tags
      const tags = await autoTagContent(contentItem);
      
      // Update the content item with the generated tags
      await this.updateContentItem(contentId, { tags });
      
      return tags;
    } catch (error) {
      console.error("Error auto-tagging content:", error);
      return ["error", "failed-to-tag"];
    }
  }
  
  async generateContentRecommendations(userId: number): Promise<any> {
    try {
      // Get user content to analyze
      const userAccounts = await this.getSocialAccountsByUserId(userId);
      const accountIds = userAccounts.map(account => account.id);
      
      // Get recent content with performance data
      const recentContent = Array.from(this.contentItems.values())
        .filter(item => accountIds.includes(item.socialAccountId))
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 20);
      
      // Get analytics data for context
      const analyticsData = await this.getAnalyticsSummary(userId);
      
      // Use OpenAI to generate recommendations
      const data = {
        content: recentContent,
        analytics: analyticsData,
        platforms: userAccounts.map(a => a.platform)
      };
      
      // Generate recommendations using OpenAI
      const recommendations = await generateContentRecommendations(data);
      return recommendations;
    } catch (error) {
      console.error("Error generating content recommendations:", error);
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
  }
  
  // Implement the new competitor analysis methods
  async analyzeCompetitors(data: any): Promise<any> {
    try {
      // Pass the data directly to OpenAI
      const analysis = await analyzeCompetitors(data);
      return analysis;
    } catch (error) {
      console.error("Error analyzing competitors:", error);
      return {
        summary: "Error generating competitor analysis. Please try again later.",
        error: true
      };
    }
  }
  
  async analyzeContentGaps(data: any): Promise<any> {
    try {
      // Pass the data directly to OpenAI
      const analysis = await analyzeContentGaps(data);
      return analysis;
    } catch (error) {
      console.error("Error analyzing content gaps:", error);
      return {
        summary: "Error generating content gap analysis. Please try again later.",
        error: true
      };
    }
  }
  
  async getContentItemsByUserId(userId: number): Promise<ContentItem[]> {
    // Get all social accounts for the user
    const userAccounts = await this.getSocialAccountsByUserId(userId);
    const accountIds = userAccounts.map(account => account.id);
    
    // Get all content items for those accounts
    return Array.from(this.contentItems.values()).filter(
      item => accountIds.includes(item.socialAccountId)
    );
  }
  
  async getContentItemsByCompetitorId(competitorId: number): Promise<any[]> {
    // For demo purposes, generate some example content for competitors
    // In a real app, this would fetch from the database
    const platforms = ["instagram", "twitter", "youtube", "tiktok"];
    const contentTypes = ["post", "video", "carousel", "story", "reel"];
    const topics = ["productivity", "marketing", "design", "technology", "business"];
    
    // Generate 5-10 random content items
    const count = 5 + Math.floor(Math.random() * 5);
    const items = [];
    
    for (let i = 0; i < count; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      items.push({
        id: 1000 + i,
        competitorId,
        platform,
        contentType,
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} ${contentType} about ${topic}`,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
        engagement: Math.random() * 5, // Random engagement rate
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
        views: Math.floor(Math.random() * 20000),
        tags: [topic, contentType, platform]
      });
    }
    
    return items;
  }
  
  // Helper method to seed some development data
  private seedData(): void {
    // Add a sample user
    const user: User = {
      id: this.userIdCounter++,
      username: "alexmorgan",
      email: "alex@example.com",
      password: "$2b$10$demohashdemohashdemoha", // Not a real hash - would be properly hashed in production
      fullName: "Alex Morgan",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      createdAt: new Date(),
      lastLogin: new Date(),
      provider: "email",
      providerId: null
    };
    this.users.set(user.id, user);
    
    // Add sample social accounts
    const platforms = [
      { platform: "youtube", handle: "AlexMorganTech", displayName: "Alex Morgan Tech", followers: 52400 },
      { platform: "instagram", handle: "alexmorgan_digital", displayName: "Alex Morgan", followers: 83200 },
      { platform: "twitter", handle: "alexmorgantech", displayName: "Alex Morgan", followers: 22800 }
    ];
    
    platforms.forEach(p => {
      const account: SocialAccount = {
        id: this.socialAccountIdCounter++,
        userId: user.id,
        platform: p.platform,
        handle: p.handle,
        displayName: p.displayName,
        profileUrl: `https://${p.platform}.com/${p.handle}`,
        accessToken: "sample-token",
        refreshToken: "sample-refresh-token",
        tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in the future
        isConnected: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatarUrl: null,
        followers: p.followers
      };
      this.socialAccounts.set(account.id, account);
      
      // Add sample content for each account
      this.addSampleContent(account.id, account.platform);
    });
    
    // Add sample analytics data
    this.addSampleAnalytics(user.id);
    
    // Add sample dashboard layout
    const layout: DashboardLayout = {
      id: this.dashboardLayoutIdCounter++,
      userId: user.id,
      name: "Default Layout",
      layout: {
        widgets: [
          { id: "performance-graph", position: { x: 0, y: 0 }, size: { width: 2, height: 1 } },
          { id: "ai-insights", position: { x: 2, y: 0 }, size: { width: 1, height: 1 } },
          { id: "engagement-heatmap", position: { x: 0, y: 1 }, size: { width: 1, height: 1 } },
          { id: "top-content", position: { x: 1, y: 1 }, size: { width: 1, height: 2 } },
          { id: "audience-overview", position: { x: 2, y: 1 }, size: { width: 1, height: 1 } },
          { id: "competitor-analysis", position: { x: 0, y: 2 }, size: { width: 2, height: 1 } },
          { id: "content-calendar", position: { x: 2, y: 2 }, size: { width: 1, height: 1 } }
        ]
      },
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.dashboardLayouts.set(layout.id, layout);
    
    // Add sample AI insights
    const insight: AiInsight = {
      id: this.aiInsightIdCounter++,
      userId: user.id,
      socialAccountId: 1,
      title: "Analysis Summary",
      summary: "Your Instagram content is outperforming your YouTube content by 28% in engagement rate this month.",
      details: [
        "Your tutorial-style posts get 2.3x more shares than other content types.",
        "Posts tagged with \"productivity\" have a 32% higher retention rate."
      ],
      recommendations: [
        "Schedule Instagram posts on Wednesdays at 6PM",
        "Create more tutorial content for YouTube"
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: null
    };
    this.aiInsightsItems.set(insight.id, insight);
  }
  
  private addSampleContent(accountId: number, platform: string): void {
    // Sample content titles and details based on platform
    const contentData: { [key: string]: any[] } = {
      youtube: [
        {
          title: "10 Productivity Tips for Remote Workers",
          description: "Learn how to stay productive while working from home with these essential tips.",
          thumbnailUrl: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          contentType: "video",
          views: 28400,
          likes: 2100,
          comments: 324,
          shares: 567,
          engagement: 10.6,
          tags: ["productivity", "remote-work", "tutorial"]
        },
        {
          title: "Office Tour 2023: How We Built Our Creative Space",
          description: "In this video, I'm giving you a full tour of our newly designed creative studio space.",
          thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          contentType: "video",
          views: 8900,
          likes: 782,
          comments: 143,
          shares: 98,
          engagement: 11.5,
          tags: ["office-tour", "workspace", "studio"]
        }
      ],
      instagram: [
        {
          title: "My Work From Home Setup (Swipe for Details)",
          description: "Check out my latest WFH setup with all the gear links in bio!",
          thumbnailUrl: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          contentType: "carousel",
          views: 12700,
          likes: 943,
          comments: 87,
          shares: 45,
          engagement: 8.5,
          tags: ["workspace", "tech", "wfh", "setup"]
        }
      ],
      twitter: [
        {
          title: "Just launched our team productivity tool after 6 months of development! Check it out [THREAD]",
          description: "Thread about our new productivity tool launch and lessons learned from development.",
          thumbnailUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          contentType: "thread",
          views: 437,
          likes: 1200,
          comments: 89,
          shares: 325,
          engagement: 370.0,
          tags: ["product-launch", "development", "productivity"]
        }
      ]
    };
    
    // Add content items for this account
    const platformContent = contentData[platform] || [];
    platformContent.forEach(content => {
      const publishedDate = new Date();
      publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days
      
      const item: ContentItem = {
        id: this.contentItemIdCounter++,
        socialAccountId: accountId,
        title: content.title,
        description: content.description,
        url: `https://${platform}.com/post${this.contentItemIdCounter}`,
        thumbnailUrl: content.thumbnailUrl,
        publishedAt: publishedDate,
        platform: platform,
        contentType: content.contentType,
        views: content.views,
        likes: content.likes,
        comments: content.comments,
        shares: content.shares,
        engagement: content.engagement,
        engagementRate: (content.engagement).toFixed(1) + "%",
        isBookmarked: false,
        tags: content.tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: null
      };
      this.contentItems.set(item.id, item);
    });
  }
  
  private addSampleAnalytics(userId: number): void {
    // Get all social accounts for the user
    const userAccounts = Array.from(this.socialAccounts.values()).filter(
      account => account.userId === userId
    );
    
    // Add analytics entries for the last 30 days for each account
    const now = new Date();
    userAccounts.forEach(account => {
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Generate some random metrics
        const followers = account.followers - Math.floor(Math.random() * 1000) * i;
        const views = Math.floor(5000 + Math.random() * 15000);
        const likes = Math.floor(200 + Math.random() * 800);
        const comments = Math.floor(20 + Math.random() * 100);
        const shares = Math.floor(10 + Math.random() * 50);
        const engagement = likes + comments + shares;
        const engagementRate = ((engagement / views) * 100).toFixed(2);
        
        const analytics: Analytics = {
          id: this.analyticsItemIdCounter++,
          userId: userId,
          socialAccountId: account.id,
          date: date,
          platform: account.platform,
          followers: followers,
          views: views,
          likes: likes,
          comments: comments,
          shares: shares,
          engagement: engagement,
          engagementRate: engagementRate,
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: null
        };
        this.analyticsItems.set(analytics.id, analytics);
      }
    });
  }
}

export const storage = new MemStorage();
