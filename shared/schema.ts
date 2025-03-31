import { pgTable, text, serial, integer, boolean, timestamp, json, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  provider: text("provider"), // 'email', 'google', 'twitter'
  providerId: text("provider_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
  avatarUrl: true,
  provider: true,
  providerId: true,
});

// Social Media Account schema
export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // 'youtube', 'instagram', 'twitter'
  handle: text("handle").notNull(),
  displayName: text("display_name"),
  profileUrl: text("profile_url"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  isConnected: boolean("is_connected").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  avatarUrl: text("avatar_url"),
  followers: integer("followers"),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).pick({
  userId: true,
  platform: true,
  handle: true,
  displayName: true,
  profileUrl: true,
  accessToken: true,
  refreshToken: true,
  tokenExpiry: true,
  avatarUrl: true,
  followers: true,
});

// Content Item schema
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  socialAccountId: integer("social_account_id").notNull().references(() => socialAccounts.id),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at"),
  platform: text("platform").notNull(), // 'youtube', 'instagram', 'twitter'
  contentType: text("content_type"), // 'video', 'image', 'carousel', 'post', 'tweet', 'thread'
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  engagement: integer("engagement").default(0),
  engagementRate: text("engagement_rate"),
  isBookmarked: boolean("is_bookmarked").default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  metadata: json("metadata"),
});

export const insertContentItemSchema = createInsertSchema(contentItems).pick({
  socialAccountId: true,
  title: true,
  description: true,
  url: true,
  thumbnailUrl: true,
  publishedAt: true,
  platform: true,
  contentType: true,
  views: true,
  likes: true,
  comments: true,
  shares: true,
  engagement: true,
  engagementRate: true,
  isBookmarked: true,
  tags: true,
  metadata: true,
});

// Analytics schema
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  socialAccountId: integer("social_account_id").references(() => socialAccounts.id),
  date: timestamp("date").notNull(),
  platform: text("platform").notNull(), // 'youtube', 'instagram', 'twitter'
  followers: integer("followers").default(0),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  engagement: integer("engagement").default(0),
  engagementRate: text("engagement_rate"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  metadata: json("metadata"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  userId: true,
  socialAccountId: true,
  date: true,
  platform: true,
  followers: true,
  views: true,
  likes: true,
  comments: true,
  shares: true,
  engagement: true,
  engagementRate: true,
  metadata: true,
});

// Dashboard Layout schema (for storing widget positions)
export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").default("Default Layout"),
  layout: json("layout").notNull(), // Store widget positions and sizes
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertDashboardLayoutSchema = createInsertSchema(dashboardLayouts).pick({
  userId: true,
  name: true,
  layout: true,
  isDefault: true,
});

// AI Insights schema
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  socialAccountId: integer("social_account_id").references(() => socialAccounts.id),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  details: text("details").array(),
  recommendations: text("recommendations").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  metadata: json("metadata"),
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).pick({
  userId: true,
  socialAccountId: true,
  title: true,
  summary: true,
  details: true,
  recommendations: true,
  metadata: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type DashboardLayout = typeof dashboardLayouts.$inferSelect;
export type InsertDashboardLayout = z.infer<typeof insertDashboardLayoutSchema>;

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
