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
      const lang = req.query.lang as string || 'pl'; // Domyślnie polski, ale obsługujemy także inne języki
      const posts = await storage.getFeaturedBlogPosts(limit);
      
      // Dostosowujemy dane w zależności od języka
      const translatedPosts = posts.map(post => {
        if (lang === 'en') {
          return {
            ...post,
            title: post.title.replace('Jak zacząć z automatyzacją', 'How to start with automation')
              .replace('Integracja systemów ERP', 'ERP systems integration')
              .replace('Przewodnik po sztucznej inteligencji', 'Guide to artificial intelligence'),
            excerpt: post.excerpt
              .replace('Praktyczne porady', 'Practical tips')
              .replace('Dowiedz się', 'Learn')
              .replace('dla firm', 'for businesses')
              .replace('Poznaj najlepsze praktyki', 'Discover best practices')
              .replace('Integracja z popularnymi systemami', 'Integration with popular systems')
          };
        } else if (lang === 'de') {
          return {
            ...post,
            title: post.title.replace('Jak zacząć z automatyzacją', 'Erste Schritte mit der Automatisierung')
              .replace('Integracja systemów ERP', 'Integration von ERP-Systemen')
              .replace('Przewodnik po sztucznej inteligencji', 'Leitfaden für künstliche Intelligenz'),
            excerpt: post.excerpt
              .replace('Praktyczne porady', 'Praktische Tipps')
              .replace('Dowiedz się', 'Erfahren Sie')
              .replace('dla firm', 'für Unternehmen')
              .replace('Poznaj najlepsze praktyki', 'Entdecken Sie bewährte Methoden')
              .replace('Integracja z popularnymi systemami', 'Integration mit gängigen Systemen')
          };
        }
        return post;
      });

      return res.json(translatedPosts);
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
  
  // Update blog post
  app.put("/api/blog-posts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingPost = await storage.getBlogPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // If slug is changing, verify it doesn't conflict
      if (req.body.slug && req.body.slug !== existingPost.slug) {
        const postWithSlug = await storage.getBlogPostBySlug(req.body.slug);
        if (postWithSlug && postWithSlug.id !== id) {
          return res.status(400).json({ message: "Slug already exists" });
        }
      }
      
      const updatedPost = await storage.updateBlogPost(id, req.body);
      return res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          errors: error.errors 
        });
      }
      console.error("Error updating blog post:", error);
      return res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  
  // Delete blog post
  app.delete("/api/blog-posts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingPost = await storage.getBlogPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      await storage.deleteBlogPost(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  
  // Get single blog post by ID for editing
  app.get("/api/blog-posts/:id/edit", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      console.error("Error fetching blog post for editing:", error);
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
      const lang = req.query.lang as string || 'pl'; // Domyślnie polski
      const templates = await storage.getFeaturedTemplates(limit);
      
      // Tłumaczenie na podstawie języka
      const translatedTemplates = templates.map(template => {
        if (lang === 'en') {
          return {
            ...template,
            title: template.title
              .replace('Automatyzacja sprzedaży', 'Sales automation')
              .replace('Integracja systemów', 'Systems integration')
              .replace('Automatyzacja raportowania', 'Reporting automation'),
            description: template.description
              .replace('Zestaw narzędzi', 'Toolkit')
              .replace('dla działów', 'for departments')
              .replace('sprzedaży', 'sales')
              .replace('do automatycznego', 'for automatic')
              .replace('zbierania danych', 'data collection')
              .replace('i generowania raportów', 'and report generation')
              .replace('Narzędzia do integracji', 'Tools for integrating')
              .replace('popularnych systemów', 'popular systems')
          };
        } else if (lang === 'de') {
          return {
            ...template,
            title: template.title
              .replace('Automatyzacja sprzedaży', 'Vertriebsautomatisierung')
              .replace('Integracja systemów', 'Systemintegration')
              .replace('Automatyzacja raportowania', 'Berichtsautomatisierung'),
            description: template.description
              .replace('Zestaw narzędzi', 'Toolkit')
              .replace('dla działów', 'für Abteilungen')
              .replace('sprzedaży', 'Vertrieb')
              .replace('do automatycznego', 'für automatische')
              .replace('zbierania danych', 'Datenerfassung')
              .replace('i generowania raportów', 'und Berichterstellung')
              .replace('Narzędzia do integracji', 'Tools zur Integration')
              .replace('popularnych systemów', 'beliebter Systeme')
          };
        }
        return template;
      });
      
      return res.json(translatedTemplates);
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
  
  // Admin routes for templates
  app.post("/api/templates", requireAuth, async (req: Request, res: Response) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      
      // Check if slug already exists
      const existingTemplate = await storage.getTemplateBySlug(templateData.slug);
      if (existingTemplate) {
        return res.status(400).json({ message: "Slug already exists" });
      }
      
      const template = await storage.createTemplate(templateData);
      return res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid template data", 
          errors: error.errors 
        });
      }
      console.error("Error creating template:", error);
      return res.status(500).json({ message: "Failed to create template" });
    }
  });
  
  // Update template
  app.put("/api/templates/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingTemplate = await storage.getTemplate(id);
      if (!existingTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // If slug is changing, verify it doesn't conflict
      if (req.body.slug && req.body.slug !== existingTemplate.slug) {
        const templateWithSlug = await storage.getTemplateBySlug(req.body.slug);
        if (templateWithSlug && templateWithSlug.id !== id) {
          return res.status(400).json({ message: "Slug already exists" });
        }
      }
      
      const updatedTemplate = await storage.updateTemplate(id, req.body);
      return res.json(updatedTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid template data", 
          errors: error.errors 
        });
      }
      console.error("Error updating template:", error);
      return res.status(500).json({ message: "Failed to update template" });
    }
  });
  
  // Delete template
  app.delete("/api/templates/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingTemplate = await storage.getTemplate(id);
      if (!existingTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      await storage.deleteTemplate(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting template:", error);
      return res.status(500).json({ message: "Failed to delete template" });
    }
  });
  
  // Get single template by ID for editing
  app.get("/api/templates/:id/edit", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      return res.json(template);
    } catch (error) {
      console.error("Error fetching template for editing:", error);
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
      const lang = req.query.lang as string || 'pl'; // Domyślnie polski
      const caseStudies = await storage.getFeaturedCaseStudies(limit);
      
      // Tłumaczenie na podstawie języka
      const translatedCaseStudies = caseStudies.map(study => {
        if (lang === 'en') {
          return {
            ...study,
            title: study.title
              .replace('Automatyzacja ekspedycji zamówień', 'Order fulfillment automation')
              .replace('Integracja systemów produkcyjnych', 'Production systems integration')
              .replace('Wdrożenie rozwiązań AI', 'AI solutions implementation'),
            description: study.description
              .replace('Usprawnienie procesu', 'Process improvement')
              .replace('ekspedycji zamówień', 'order fulfillment')
              .replace('dla firmy logistycznej', 'for a logistics company')
              .replace('Połączenie różnych systemów', 'Integration of different systems')
              .replace('w jeden ekosystem', 'into one ecosystem')
              .replace('dla dużego producenta', 'for a large manufacturer')
              .replace('Wdrożenie sztucznej inteligencji', 'Implementation of artificial intelligence')
              .replace('w dziale obsługi klienta', 'in customer service')
              .replace('znacznie obniżyło koszty', 'significantly lowered costs'),
            tools: study.tools?.map(tool => 
              tool === 'Automatyzacja procesów' ? 'Process automation' :
              tool === 'Integracja systemów' ? 'Systems integration' :
              tool === 'Sztuczna inteligencja' ? 'Artificial intelligence' :
              tool === 'RPA' ? 'RPA' :
              tool === 'Make.com' ? 'Make.com' :
              tool === 'Zapier' ? 'Zapier' :
              tool === 'Własne API' ? 'Custom API' :
              tool === 'Analiza danych' ? 'Data analysis' :
              tool
            )
          };
        } else if (lang === 'de') {
          return {
            ...study,
            title: study.title
              .replace('Automatyzacja ekspedycji zamówień', 'Auftragsabwicklungsautomatisierung')
              .replace('Integracja systemów produkcyjnych', 'Integration von Produktionssystemen')
              .replace('Wdrożenie rozwiązań AI', 'Implementierung von KI-Lösungen'),
            description: study.description
              .replace('Usprawnienie procesu', 'Prozessverbesserung')
              .replace('ekspedycji zamówień', 'der Auftragsabwicklung')
              .replace('dla firmy logistycznej', 'für ein Logistikunternehmen')
              .replace('Połączenie różnych systemów', 'Integration verschiedener Systeme')
              .replace('w jeden ekosystem', 'in ein Ökosystem')
              .replace('dla dużego producenta', 'für einen großen Hersteller')
              .replace('Wdrożenie sztucznej inteligencji', 'Implementierung von künstlicher Intelligenz')
              .replace('w dziale obsługi klienta', 'im Kundenservice')
              .replace('znacznie obniżyło koszty', 'senkte die Kosten erheblich'),
            tools: study.tools?.map(tool => 
              tool === 'Automatyzacja procesów' ? 'Prozessautomatisierung' :
              tool === 'Integracja systemów' ? 'Systemintegration' :
              tool === 'Sztuczna inteligencja' ? 'Künstliche Intelligenz' :
              tool === 'RPA' ? 'RPA' :
              tool === 'Make.com' ? 'Make.com' :
              tool === 'Zapier' ? 'Zapier' :
              tool === 'Własne API' ? 'Eigene API' :
              tool === 'Analiza danych' ? 'Datenanalyse' :
              tool
            )
          };
        }
        return study;
      });
      
      return res.json(translatedCaseStudies);
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
  
  // Admin routes for case studies
  app.post("/api/case-studies", requireAuth, async (req: Request, res: Response) => {
    try {
      const caseStudyData = insertCaseStudySchema.parse(req.body);
      
      // Check if slug already exists
      const existingCaseStudy = await storage.getCaseStudyBySlug(caseStudyData.slug);
      if (existingCaseStudy) {
        return res.status(400).json({ message: "Slug already exists" });
      }
      
      const caseStudy = await storage.createCaseStudy(caseStudyData);
      return res.status(201).json(caseStudy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid case study data", 
          errors: error.errors 
        });
      }
      console.error("Error creating case study:", error);
      return res.status(500).json({ message: "Failed to create case study" });
    }
  });
  
  // Update case study
  app.put("/api/case-studies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingCaseStudy = await storage.getCaseStudy(id);
      if (!existingCaseStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      
      // If slug is changing, verify it doesn't conflict
      if (req.body.slug && req.body.slug !== existingCaseStudy.slug) {
        const caseStudyWithSlug = await storage.getCaseStudyBySlug(req.body.slug);
        if (caseStudyWithSlug && caseStudyWithSlug.id !== id) {
          return res.status(400).json({ message: "Slug already exists" });
        }
      }
      
      const updatedCaseStudy = await storage.updateCaseStudy(id, req.body);
      return res.json(updatedCaseStudy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid case study data", 
          errors: error.errors 
        });
      }
      console.error("Error updating case study:", error);
      return res.status(500).json({ message: "Failed to update case study" });
    }
  });
  
  // Delete case study
  app.delete("/api/case-studies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingCaseStudy = await storage.getCaseStudy(id);
      if (!existingCaseStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      
      await storage.deleteCaseStudy(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting case study:", error);
      return res.status(500).json({ message: "Failed to delete case study" });
    }
  });
  
  // Get single case study by ID for editing
  app.get("/api/case-studies/:id/edit", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const caseStudy = await storage.getCaseStudy(id);
      if (!caseStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      
      return res.json(caseStudy);
    } catch (error) {
      console.error("Error fetching case study for editing:", error);
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
  
  // Admin routes for contact messages
  app.get("/api/contact-messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getContactSubmissions();
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  
  app.delete("/api/contact-messages/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingMessage = await storage.getContactSubmission(id);
      if (!existingMessage) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      
      await storage.deleteContactSubmission(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return res.status(500).json({ message: "Failed to delete contact message" });
    }
  });
  
  // Admin routes for newsletter subscribers
  app.get("/api/newsletter-subscribers", requireAuth, async (req: Request, res: Response) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      return res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      return res.status(500).json({ message: "Failed to fetch newsletter subscribers" });
    }
  });
  
  app.delete("/api/newsletter-subscribers/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingSubscriber = await storage.getNewsletterSubscriber(id);
      if (!existingSubscriber) {
        return res.status(404).json({ message: "Newsletter subscriber not found" });
      }
      
      await storage.deleteNewsletterSubscriber(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting newsletter subscriber:", error);
      return res.status(500).json({ message: "Failed to delete newsletter subscriber" });
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
