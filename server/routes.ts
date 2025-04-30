import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSubscriberSchema,
  insertBlogPostSchema,
  insertTemplateSchema,
  insertCaseStudySchema
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import { randomBytes } from "crypto";
import { generateChatResponse } from "./openai";

// Interface for a user from the session
interface SessionUser {
  id: number;
  username: string;
}

// Extend Express.Session to include a user property
declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: "automatyzator-admin-panel-secret", // Stały sekret dla rozwoju
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Ustawione na false dla rozwoju
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    })
  );

  // Middleware to check authentication for admin routes
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Admin login
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Get user by username
      const user = await storage.getUserByUsername(username);

      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Set user in session (omit password)
      req.session.user = {
        id: user.id,
        username: user.username,
      };

      res.json({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Get current logged in user
  app.get("/api/admin/me", (req: Request, res: Response) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.session.user);
  });

  // Create admin user (this would usually be restricted or done via a seeder script)
  app.post("/api/admin/setup", async (req: Request, res: Response) => {
    try {
      // Check if an admin user already exists
      const adminUser = await storage.getUserByUsername("admin");
      
      if (adminUser) {
        return res.status(400).json({ message: "Admin user already exists" });
      }
      
      // Create admin user
      const user = await storage.createUser({
        username: "admin",
        password: "admin123" // This would be hashed in a real application
      });
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        message: "Admin user created successfully"
      });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  // Blog posts endpoints
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const posts = await storage.getFeaturedBlogPosts(limit);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      return res.status(500).json({ message: "Failed to fetch featured blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      return res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  
  // Admin routes for blog posts
  app.post("/api/blog-posts", requireAuth, async (req: Request, res: Response) => {
    try {
      const blogPostData = insertBlogPostSchema.parse(req.body);
      
      // Check if slug already exists
      const existingPost = await storage.getBlogPostBySlug(blogPostData.slug);
      if (existingPost) {
        return res.status(400).json({ message: "Slug already exists" });
      }
      
      const post = await storage.createBlogPost(blogPostData);
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          errors: error.errors 
        });
      }
      console.error("Error creating blog post:", error);
      return res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Templates endpoints
  app.get("/api/templates", async (req: Request, res: Response) => {
    try {
      const templates = await storage.getTemplates();
      return res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      return res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const templates = await storage.getFeaturedTemplates(limit);
      return res.json(templates);
    } catch (error) {
      console.error("Error fetching featured templates:", error);
      return res.status(500).json({ message: "Failed to fetch featured templates" });
    }
  });

  app.get("/api/templates/:slug", async (req: Request, res: Response) => {
    try {
      const template = await storage.getTemplateBySlug(req.params.slug);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      return res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      return res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Case studies endpoints
  app.get("/api/case-studies", async (req: Request, res: Response) => {
    try {
      const caseStudies = await storage.getCaseStudies();
      return res.json(caseStudies);
    } catch (error) {
      console.error("Error fetching case studies:", error);
      return res.status(500).json({ message: "Failed to fetch case studies" });
    }
  });

  app.get("/api/case-studies/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const caseStudies = await storage.getFeaturedCaseStudies(limit);
      return res.json(caseStudies);
    } catch (error) {
      console.error("Error fetching featured case studies:", error);
      return res.status(500).json({ message: "Failed to fetch featured case studies" });
    }
  });

  app.get("/api/case-studies/:slug", async (req: Request, res: Response) => {
    try {
      const caseStudy = await storage.getCaseStudyBySlug(req.params.slug);
      if (!caseStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      return res.json(caseStudy);
    } catch (error) {
      console.error("Error fetching case study:", error);
      return res.status(500).json({ message: "Failed to fetch case study" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const submission = insertContactSubmissionSchema.parse(req.body);
      const result = await storage.createContactSubmission(submission);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: error.errors 
        });
      }
      console.error("Error submitting contact form:", error);
      return res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req: Request, res: Response) => {
    try {
      const subscriber = insertNewsletterSubscriberSchema.parse(req.body);
      const result = await storage.createNewsletterSubscriber(subscriber);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid email", 
          errors: error.errors 
        });
      }
      console.error("Error subscribing to newsletter:", error);
      return res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });
  
  // Chat with OpenAI endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, language = 'pl' } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required and must be a string" });
      }
      
      // Przekaż język jako parametr do funkcji generateChatResponse
      const response = await generateChatResponse(message, language);
      return res.json({ response });
    } catch (error) {
      console.error("Error generating chat response:", error);
      return res.status(500).json({ 
        message: "Failed to generate response", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
