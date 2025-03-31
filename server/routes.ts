import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes } from "./routes/auth";
import { registerAccountRoutes } from "./routes/accounts";
import { registerAnalyticsRoutes } from "./routes/analytics";
import { registerContentRoutes } from "./routes/content";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all API routes
  registerAuthRoutes(app, storage);
  registerAccountRoutes(app, storage);
  registerAnalyticsRoutes(app, storage);
  registerContentRoutes(app, storage);

  // API endpoint for dashboard layouts
  app.get("/api/dashboard/layouts", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const layouts = await storage.getDashboardLayoutsByUserId(userId);
      res.json({ layouts });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/dashboard/layouts", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const layoutData = req.body;
      const layout = await storage.createDashboardLayout({
        ...layoutData,
        userId,
      });

      res.status(201).json(layout);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/dashboard/layouts/:id", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const layoutId = parseInt(req.params.id);
      const layoutData = req.body;
      
      // Ensure the layout belongs to the user
      const existingLayout = await storage.getDashboardLayoutById(layoutId);
      if (!existingLayout || existingLayout.userId !== userId) {
        return res.status(404).json({ message: "Layout not found" });
      }

      const updatedLayout = await storage.updateDashboardLayout(layoutId, layoutData);
      res.json(updatedLayout);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/dashboard/layouts/:id", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const layoutId = parseInt(req.params.id);
      
      // Ensure the layout belongs to the user
      const existingLayout = await storage.getDashboardLayoutById(layoutId);
      if (!existingLayout || existingLayout.userId !== userId) {
        return res.status(404).json({ message: "Layout not found" });
      }

      await storage.deleteDashboardLayout(layoutId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add AI-related endpoints
  app.post("/api/ai/search", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      const result = await storage.processNaturalLanguageQuery(userId, query);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-insights", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const insights = await storage.generateAIInsights(userId);
      res.json(insights);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/auto-tag", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { contentId } = req.body;
      if (!contentId) {
        return res.status(400).json({ message: "Content ID is required" });
      }

      const tags = await storage.autoTagContent(contentId);
      res.json({ tags });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ai/content-recommendations", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const recommendations = await storage.generateContentRecommendations(userId);
      res.json({ recommendations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
