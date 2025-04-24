import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSubscriberSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
