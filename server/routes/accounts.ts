import { Router, Express } from "express";
import { z } from "zod";
import { IStorage } from "../storage";
import { insertSocialAccountSchema } from "@shared/schema";

// Input validation schemas
const connectAccountSchema = z.object({
  platform: z.string(),
  handle: z.string(),
  displayName: z.string().optional(),
  profileUrl: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  tokenExpiry: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export function registerAccountRoutes(app: Express, storage: IStorage) {
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

  // Get all social accounts for the current user
  router.get("/", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const accounts = await storage.getSocialAccountsByUserId(userId);
      
      res.json({ accounts });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Connect a new social account
  router.post("/connect", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const accountData = connectAccountSchema.parse(req.body);
      
      // Check if the account is already connected
      const existingAccounts = await storage.getSocialAccountsByUserId(userId);
      const existing = existingAccounts.find(
        a => a.platform === accountData.platform && a.handle === accountData.handle
      );
      
      if (existing) {
        // Update existing account
        const updated = await storage.updateSocialAccount(existing.id, {
          accessToken: accountData.accessToken,
          refreshToken: accountData.refreshToken || null,
          tokenExpiry: accountData.tokenExpiry ? new Date(accountData.tokenExpiry) : null,
          isConnected: true,
          displayName: accountData.displayName || existing.displayName,
          profileUrl: accountData.profileUrl || existing.profileUrl,
          avatarUrl: accountData.avatarUrl || existing.avatarUrl,
        });
        
        return res.json(updated);
      }
      
      // Create new account
      const account = await storage.createSocialAccount({
        userId,
        platform: accountData.platform,
        handle: accountData.handle,
        displayName: accountData.displayName,
        profileUrl: accountData.profileUrl,
        accessToken: accountData.accessToken,
        refreshToken: accountData.refreshToken,
        tokenExpiry: accountData.tokenExpiry ? new Date(accountData.tokenExpiry) : undefined,
        avatarUrl: accountData.avatarUrl,
        followers: 0, // Will be updated with actual data during sync
      });
      
      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Disconnect a social account
  router.post("/:id/disconnect", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const accountId = parseInt(req.params.id);
      
      // Verify the account belongs to the user
      const account = await storage.getSocialAccount(accountId);
      if (!account || account.userId !== userId) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      await storage.disconnectSocialAccount(accountId);
      res.status(200).json({ message: "Account disconnected successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Sync data for a social account
  router.post("/:id/sync", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const accountId = parseInt(req.params.id);
      
      // Verify the account belongs to the user
      const account = await storage.getSocialAccount(accountId);
      if (!account || account.userId !== userId) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // In a real app, this would fetch new data from the social platform API
      // For this demo, we'll just return a success message
      res.json({ 
        message: "Account synced successfully",
        lastSynced: new Date().toISOString(),
        newItemsCount: 0
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get statistics for a specific social account
  router.get("/:id/statistics", authenticate, async (req, res) => {
    try {
      const userId = req.userId;
      const accountId = parseInt(req.params.id);
      
      // Verify the account belongs to the user
      const account = await storage.getSocialAccount(accountId);
      if (!account || account.userId !== userId) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Get analytics data for this account
      const analyticsData = await storage.getAnalyticsBySocialAccountId(accountId);
      
      // Process data to return statistics
      const statistics = {
        followers: account.followers || 0,
        followersGrowth: {
          weekly: Math.floor(Math.random() * 100) + 20, // Sample data
          monthly: Math.floor(Math.random() * 500) + 100,
        },
        engagement: {
          rate: parseFloat((Math.random() * 5 + 1).toFixed(1)),
          trend: (Math.random() > 0.5 ? 1 : -1) * parseFloat((Math.random() * 2).toFixed(1)),
        },
        views: {
          total: Math.floor(Math.random() * 100000) + 10000,
          trend: Math.floor((Math.random() > 0.5 ? 1 : -1) * (Math.random() * 20) + 5),
        },
        contentCount: analyticsData.length,
      };
      
      res.json(statistics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add accounts routes to main app
  app.use("/api/accounts", router);
}
