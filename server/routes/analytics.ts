import { Router, Express } from "express";
import { z } from "zod";
import { IStorage } from "../storage";

// Input validation schemas
const timeframeSchema = z.enum(["30days", "quarter", "ytd"]);
const competitorSchema = z.object({
  handle: z.string(),
  platform: z.string().optional(),
});

export function registerAnalyticsRoutes(app: Express, storage: IStorage) {
  const router = Router();

  // Authentication middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = userId;
    next();
  };

  // Get analytics summary
  router.get("/summary", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const summary = await storage.getAnalyticsSummary(userId);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get specific metric
  router.get("/:metric", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const metric = req.params.metric;
      
      // Validate metric name
      if (!["followers", "engagement", "views", "content"].includes(metric)) {
        return res.status(400).json({ message: "Invalid metric" });
      }
      
      const summary = await storage.getAnalyticsSummary(userId);
      
      let result;
      switch (metric) {
        case "followers":
          result = summary.followers;
          break;
        case "engagement":
          result = summary.engagement;
          break;
        case "views":
          result = summary.views;
          break;
        case "content":
          result = summary.contentCount;
          break;
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get performance data for the chart
  router.get("/performance", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const timeframe = timeframeSchema.parse(req.query.timeframe || "30days");
      
      const performanceData = await storage.getPerformanceData(userId, timeframe);
      res.json(performanceData);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid timeframe. Use 30days, quarter, or ytd" });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get engagement heatmap data
  router.get("/heatmap", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const heatmapData = await storage.getHeatmapData(userId);
      res.json(heatmapData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get audience data
  router.get("/audience", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const audienceData = await storage.getAudienceData(userId);
      res.json(audienceData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get competitor analysis data
  router.get("/competitors", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const competitorData = await storage.getCompetitorData(userId);
      res.json(competitorData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get AI-powered competitor analysis
  router.get("/competitors/analysis", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const platform = req.query.platform as string || "all";
      
      // Get competitor data
      const competitorData = await storage.getCompetitorData(userId);
      
      // Get user data for comparison
      const userContent = await storage.getTopPerformingContent(userId, 5);
      
      // Prepare data for AI analysis
      const analysisData = {
        userData: {
          metrics: {
            engagement: 3.2,
            followers: 15000,
            posts: 120,
            growthRate: 2.4
          },
          content: { topPerforming: userContent }
        },
        competitorData,
        platform,
        timePeriod: "last 30 days"
      };
      
      // Generate AI-powered competitor analysis
      const analysis = await storage.generateAIInsights(userId, analysisData);
      res.json(analysis);
    } catch (error: any) {
      console.error("Competitor analysis error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get competitor content gap analysis
  router.get("/competitors/content-gaps", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const platform = req.query.platform as string || "all";
      
      // Get competitor data
      const competitorData = await storage.getCompetitorData(userId);
      
      // Get user content
      const userContent = await storage.getTopPerformingContent(userId, 10);
      
      // Mock competitor content data structure
      const competitorContent = competitorData.competitors.map((comp: any) => ({
        competitorId: comp.id,
        name: comp.name,
        content: comp.recentContent || []
      }));
      
      // Prepare data for content gap analysis
      const analysisData = {
        userContent,
        competitorContent,
        userAnalytics: {
          engagement: 3.2,
          topFormats: ["image", "carousel"],
          topThemes: ["education", "tips"]
        },
        platform
      };
      
      // Generate AI content gap analysis 
      const analysis = await storage.analyzeContentGaps(analysisData);
      res.json(analysis);
    } catch (error: any) {
      console.error("Content gap analysis error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Add a competitor
  router.post("/competitors", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const competitorData = competitorSchema.parse(req.body);
      
      const competitor = await storage.addCompetitor(userId, competitorData);
      res.status(201).json(competitor);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid competitor data" });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Remove a competitor
  router.delete("/competitors/:id", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const competitorId = parseInt(req.params.id);
      
      await storage.removeCompetitor(userId, competitorId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add analytics routes to main app
  app.use("/api/analytics", router);
}
