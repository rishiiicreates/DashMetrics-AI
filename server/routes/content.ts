import { Router, Express } from "express";
import { z } from "zod";
import { IStorage } from "../storage";

// Input validation schemas
const bookmarkSchema = z.object({
  isBookmarked: z.boolean(),
});

const contentFilterSchema = z.object({
  platform: z.string().optional(),
  contentType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["date", "engagement", "views"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export function registerContentRoutes(app: Express, storage: IStorage) {
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

  // Get content count
  router.get("/count", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      
      // Get all social accounts for the user
      const accounts = await storage.getSocialAccountsByUserId(userId);
      let totalCount = 0;
      
      // Count all content items for all accounts
      for (const account of accounts) {
        const items = await storage.getContentItemsBySocialAccountId(account.id);
        totalCount += items.length;
      }
      
      // Return the count in the expected format for StatCard
      res.json({
        value: totalCount.toString(),
        change: Math.floor(Math.random() * 10), // Mock data for demo
        period: "new this month"
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get top performing content
  router.get("/top-performing", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const limit = parseInt(req.query.limit as string || "4");
      
      const items = await storage.getTopPerformingContent(userId, limit);
      
      // Transform the items to match the expected format in the frontend
      const formattedItems = items.map(item => {
        // Determine platform icon (handled on the frontend)
        return {
          id: item.id,
          title: item.title,
          platform: item.platform,
          thumbnailUrl: item.thumbnailUrl,
          views: item.views || 0,
          likes: item.likes || 0
        };
      });
      
      res.json({ items: formattedItems });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get content calendar data
  router.get("/calendar", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const month = req.query.month as string; // Format: 'yyyy-MM'
      
      // In a real app, fetch scheduled posts for the given month
      // For demo, return sample data
      const scheduledPosts = [
        { id: 1, title: "YouTube Tutorial", platform: "YouTube", date: "2023-06-17", time: "10:00 AM", color: "#6200EA" },
        { id: 2, title: "Instagram Carousel", platform: "Instagram", date: "2023-06-21", time: "6:00 PM", color: "#FF9100" },
        { id: 3, title: "Twitter Thread", platform: "Twitter", date: "2023-06-24", time: "12:00 PM", color: "#FF4081" }
      ];
      
      res.json({ scheduledPosts });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all content items with filtering
  router.get("/", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      
      // Parse filter parameters
      const filters = contentFilterSchema.parse({
        platform: req.query.platform,
        contentType: req.query.contentType,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        sortBy: req.query.sortBy || "date",
        sortOrder: req.query.sortOrder || "desc"
      });
      
      // Get all social accounts for the user
      const accounts = await storage.getSocialAccountsByUserId(userId);
      let allItems = [];
      
      // Get content items for all accounts
      for (const account of accounts) {
        if (filters.platform && account.platform !== filters.platform) {
          continue;
        }
        
        const items = await storage.getContentItemsBySocialAccountId(account.id);
        allItems.push(...items);
      }
      
      // Apply filters
      let filteredItems = allItems;
      
      if (filters.contentType) {
        filteredItems = filteredItems.filter(item => item.contentType === filters.contentType);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredItems = filteredItems.filter(item => {
          if (!item.tags) return false;
          return filters.tags!.some(tag => item.tags!.includes(tag));
        });
      }
      
      // Apply sorting
      filteredItems.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case "date":
            aValue = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
            bValue = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
            break;
          case "engagement":
            aValue = a.engagement || 0;
            bValue = b.engagement || 0;
            break;
          case "views":
            aValue = a.views || 0;
            bValue = b.views || 0;
            break;
          default:
            aValue = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
            bValue = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
        }
        
        return filters.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
      
      // Paginate results
      const page = parseInt(req.query.page as string || "1");
      const pageSize = parseInt(req.query.pageSize as string || "20");
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedItems = filteredItems.slice(start, end);
      
      res.json({
        items: paginatedItems,
        total: filteredItems.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredItems.length / pageSize)
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid filter parameters" });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get a single content item by ID
  router.get("/:id", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const contentId = parseInt(req.params.id);
      
      const item = await storage.getContentItem(contentId);
      if (!item) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Verify the item belongs to one of the user's accounts
      const accounts = await storage.getSocialAccountsByUserId(userId);
      const accountIds = accounts.map(a => a.id);
      
      if (!accountIds.includes(item.socialAccountId)) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Toggle bookmark status for a content item
  router.patch("/:id/bookmark", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const contentId = parseInt(req.params.id);
      const { isBookmarked } = bookmarkSchema.parse(req.body);
      
      // Get the content item
      const item = await storage.getContentItem(contentId);
      if (!item) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Verify the item belongs to one of the user's accounts
      const accounts = await storage.getSocialAccountsByUserId(userId);
      const accountIds = accounts.map(a => a.id);
      
      if (!accountIds.includes(item.socialAccountId)) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Update bookmark status
      const updatedItem = await storage.updateContentItem(contentId, { isBookmarked });
      res.json(updatedItem);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request body" });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get content items by tag
  router.get("/tags/:tag", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const tag = req.params.tag;
      
      const items = await storage.getContentItemsByTag(userId, tag);
      res.json({ items, tag });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add content routes to main app
  app.use("/api/content", router);
}
