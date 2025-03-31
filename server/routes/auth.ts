import { Router, Express } from "express";
import { z } from "zod";
import { IStorage } from "../storage";
import bcrypt from "bcrypt";

// Input validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const socialAuthSchema = z.object({
  user: z.object({
    uid: z.string(),
    email: z.string().email().optional().nullable(),
    displayName: z.string().optional().nullable(),
    photoURL: z.string().optional().nullable(),
    provider: z.string(),
  }),
  token: z.string().optional(),
});

export function registerAuthRoutes(app: Express, storage: IStorage) {
  const router = Router();

  // Login route
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if it's a password-based account
      if (!user.password) {
        return res.status(401).json({ 
          message: "This account uses social login. Please log in with the appropriate social provider." 
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Update last login timestamp
      await storage.updateUser(user.id, { lastLogin: new Date() });

      // Set user in session
      req.session.userId = user.id;
      
      // Return user data (excluding sensitive info)
      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Register route
  router.post("/register", async (req, res) => {
    try {
      const { email, username, password, fullName, avatarUrl } = registerSchema.parse(req.body);

      // Check if email is already taken
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Check if username is already taken
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
        fullName,
        avatarUrl,
        provider: "email",
        providerId: null,
      });

      // Set user in session
      req.session.userId = user.id;
      
      // Return user data (excluding sensitive info)
      res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Social login/register route
  router.post("/social", async (req, res) => {
    try {
      const { user: socialUser, token } = socialAuthSchema.parse(req.body);
      const { uid, email, displayName, photoURL, provider } = socialUser;

      // Check if user already exists by provider ID
      let user = await storage.getUserByProviderId(provider, uid);

      if (!user && email) {
        // If not found by provider ID, try to find by email
        user = await storage.getUserByEmail(email);
      }

      if (user) {
        // User exists, update last login and social credentials if needed
        if (user.provider !== provider || user.providerId !== uid) {
          await storage.updateUser(user.id, {
            provider,
            providerId: uid,
            lastLogin: new Date(),
          });
        } else {
          await storage.updateUser(user.id, { 
            lastLogin: new Date() 
          });
        }
      } else {
        // New user, create account
        const username = email ? email.split('@')[0] : `user_${Date.now()}`;
        
        // Check if username exists and append numbers if needed
        let finalUsername = username;
        let counter = 1;
        while (await storage.getUserByUsername(finalUsername)) {
          finalUsername = `${username}${counter}`;
          counter++;
        }

        user = await storage.createUser({
          email: email || `${uid}@${provider}.auth`,
          username: finalUsername,
          password: null, // Social login doesn't use password
          fullName: displayName || undefined,
          avatarUrl: photoURL || undefined,
          provider,
          providerId: uid,
        });
      }

      // Set user in session
      req.session.userId = user.id;
      
      // Return user data
      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Logout route
  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid"); // Clear session cookie
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Current user route
  router.get("/me", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }

      // Return user data (excluding sensitive info)
      res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add auth routes to main app
  app.use("/api/auth", router);
}
