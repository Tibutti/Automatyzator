import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertNewsletterSubscriberSchema,
  insertBlogPostSchema,
  insertTemplateSchema,
  insertCaseStudySchema,
  insertWhyUsItemSchema,
  insertServiceSchema,
  insertTrainingSchema,
  insertSectionSettingSchema,
  insertHeroSettingSchema
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import { generateChatResponse } from "./openai";
import csurf from "csurf";
import helmet from "helmet";
import { 
  hashPassword, 
  comparePasswords, 
  isAccountLocked, 
  shouldLockAccount, 
  calculateLockoutTime, 
  timeUntilUnlock,
  SESSION_MAX_AGE,
  generateSecureToken,
  generatePasswordResetToken,
  isResetTokenValid,
  isPasswordStrong,
  PASSWORD_RESET_TOKEN_EXPIRY
} from "./security";

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
      secret: process.env.SESSION_SECRET || generateSecureToken(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: SESSION_MAX_AGE,
        sameSite: "lax"
      },
    })
  );
  
  // Konfiguracja nagłówków bezpieczeństwa za pomocą Helmet (po sesji)
  app.use(
    helmet({
      // Podstawowe zabezpieczenia
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "https://*"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", "https://api.openai.com"],
          frameSrc: ["'self'", "https://calendly.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      // Zapobieganie clickjacking przez ustawienie X-Frame-Options
      frameguard: {
        action: "sameorigin",
      },
      // Ustaw nagłówek Cross-Origin-Resource-Policy
      crossOriginResourcePolicy: { policy: "cross-origin" },
      // Ustaw nagłówek X-XSS-Protection
      xssFilter: true,
      // Ustaw nagłówek Strict-Transport-Security
      hsts: {
        maxAge: 31536000, // 1 rok
        includeSubDomains: true,
        preload: true,
      },
      // Ustaw nagłówek X-Permitted-Cross-Domain-Policies
      permittedCrossDomainPolicies: {
        permittedPolicies: "none",
      },
      // Ustaw nagłówek Referrer-Policy
      referrerPolicy: {
        policy: "same-origin",
      },
    })
  );

  // Setup CSRF protection
  const csrfProtection = csurf({ 
    cookie: {
      key: '_csrf',
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: '/'
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
  });
  
  // Apply CSRF protection to all state-changing routes (POST, PUT, DELETE)
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF protection for APIs that don't require it (like public GET endpoints)
    const skipCSRF = 
      req.method === "GET" || 
      req.path === "/api/admin/login" || 
      req.path === "/api/chat" ||
      req.path.startsWith("/api/auth/"); // Skip for auth-related endpoints like password reset
      
    if (skipCSRF) {
      next();
    } else {
      csrfProtection(req, res, next);
    }
  });
  
  // Middleware to provide CSRF token to the client
  app.get("/api/csrf-token", csrfProtection, (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken() });
  });
  
  // Add CSRF token to all responses
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Store the original json method
    const originalJson = res.json;
    
    // Override the json method
    res.json = function(body) {
      // Only add csrf token if it exists on the request
      if ((req as any).csrfToken) {
        // If body is already an object, add the token
        if (typeof body === 'object' && body !== null) {
          body._csrf = (req as any).csrfToken();
        }
      }
      // Call the original json method
      return originalJson.call(this, body);
    };
    
    next();
  });

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

      // Check if user exists
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Check if account is locked
      if (isAccountLocked(user)) {
        const timeLeft = timeUntilUnlock(user.lockedUntil!);
        return res.status(403).json({ 
          message: `Account is locked. Please try again in ${Math.ceil(timeLeft / 60000)} minutes.` 
        });
      }
      
      // Verify password
      const passwordValid = await comparePasswords(password, user.password);
      
      if (!passwordValid) {
        // Increment login attempts
        const newAttempts = (user.loginAttempts || 0) + 1;
        await storage.updateUserLoginAttempts(user.id, newAttempts);
        
        // Check if account should be locked
        if (shouldLockAccount(newAttempts)) {
          const lockTime = calculateLockoutTime();
          await storage.updateUserLockedUntil(user.id, lockTime);
          return res.status(403).json({ 
            message: `Too many failed login attempts. Account locked for 15 minutes.` 
          });
        }
        
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Successful login - reset login attempts and update last login
      await storage.updateUserLastLogin(user.id);
      
      // Set user in session (omit password and security fields)
      req.session.user = {
        id: user.id,
        username: user.username,
      };

      res.json({
        id: user.id,
        username: user.username,
        lastLoginAt: user.lastLoginAt
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
      
      // Create admin user with a secure hashed password
      const hashedPassword = await hashPassword("admin123");
      const user = await storage.createUser({
        username: "admin",
        password: hashedPassword
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
      const slugOrId = req.params.slug;
      let post;
      
      // Sprawdzamy, czy to liczba (ID) czy string (slug)
      const id = parseInt(slugOrId);
      if (!isNaN(id)) {
        post = await storage.getBlogPost(id);
      } else {
        post = await storage.getBlogPostBySlug(slugOrId);
      }
      
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
  
  // "Dlaczego Automatyzator?" (Why Us) endpoints
  app.get("/api/why-us", async (req: Request, res: Response) => {
    try {
      const lang = req.query.lang as string || 'pl';
      const items = await storage.getWhyUsItems(lang);
      return res.json(items);
    } catch (error) {
      console.error("Error fetching Why Us items:", error);
      return res.status(500).json({ message: "Failed to fetch Why Us items" });
    }
  });
  
  app.get("/api/why-us/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const item = await storage.getWhyUsItem(id);
      if (!item) {
        return res.status(404).json({ message: "Why Us item not found" });
      }
      
      return res.json(item);
    } catch (error) {
      console.error("Error fetching Why Us item:", error);
      return res.status(500).json({ message: "Failed to fetch Why Us item" });
    }
  });
  
  // Admin routes for Why Us items
  app.post("/api/why-us", requireAuth, async (req: Request, res: Response) => {
    try {
      const whyUsItemData = insertWhyUsItemSchema.parse(req.body);
      const item = await storage.createWhyUsItem(whyUsItemData);
      return res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid Why Us item data", 
          errors: error.errors 
        });
      }
      console.error("Error creating Why Us item:", error);
      return res.status(500).json({ message: "Failed to create Why Us item" });
    }
  });
  
  app.put("/api/why-us/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingItem = await storage.getWhyUsItem(id);
      if (!existingItem) {
        return res.status(404).json({ message: "Why Us item not found" });
      }
      
      const updatedItem = await storage.updateWhyUsItem(id, req.body);
      return res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid Why Us item data", 
          errors: error.errors 
        });
      }
      console.error("Error updating Why Us item:", error);
      return res.status(500).json({ message: "Failed to update Why Us item" });
    }
  });
  
  app.delete("/api/why-us/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingItem = await storage.getWhyUsItem(id);
      if (!existingItem) {
        return res.status(404).json({ message: "Why Us item not found" });
      }
      
      await storage.deleteWhyUsItem(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting Why Us item:", error);
      return res.status(500).json({ message: "Failed to delete Why Us item" });
    }
  });
  
  // "Nasze usługi" (Services) endpoints
  app.get("/api/services", async (req: Request, res: Response) => {
    try {
      const lang = req.query.lang as string || 'pl';
      const services = await storage.getServices(lang);
      return res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      return res.status(500).json({ message: "Failed to fetch services" });
    }
  });
  
  app.get("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      return res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      return res.status(500).json({ message: "Failed to fetch service" });
    }
  });
  
  // Admin routes for Services
  app.post("/api/services", requireAuth, async (req: Request, res: Response) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      return res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid service data", 
          errors: error.errors 
        });
      }
      console.error("Error creating service:", error);
      return res.status(500).json({ message: "Failed to create service" });
    }
  });
  
  app.put("/api/services/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingService = await storage.getService(id);
      if (!existingService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      const updatedService = await storage.updateService(id, req.body);
      return res.json(updatedService);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid service data", 
          errors: error.errors 
        });
      }
      console.error("Error updating service:", error);
      return res.status(500).json({ message: "Failed to update service" });
    }
  });
  
  app.delete("/api/services/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingService = await storage.getService(id);
      if (!existingService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      await storage.deleteService(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting service:", error);
      return res.status(500).json({ message: "Failed to delete service" });
    }
  });
  
  // Szkolenia (Trainings) endpoints
  app.get("/api/trainings", async (req: Request, res: Response) => {
    try {
      const lang = req.query.lang as string || 'pl';
      const trainings = await storage.getTrainings(lang);
      return res.json(trainings);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      return res.status(500).json({ message: "Failed to fetch trainings" });
    }
  });
  
  app.get("/api/trainings/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const trainings = await storage.getFeaturedTrainings(limit);
      return res.json(trainings);
    } catch (error) {
      console.error("Error fetching featured trainings:", error);
      return res.status(500).json({ message: "Failed to fetch featured trainings" });
    }
  });
  
  app.get("/api/trainings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const training = await storage.getTraining(id);
      if (!training) {
        return res.status(404).json({ message: "Training not found" });
      }
      
      return res.json(training);
    } catch (error) {
      console.error("Error fetching training:", error);
      return res.status(500).json({ message: "Failed to fetch training" });
    }
  });
  
  // Admin routes for trainings
  app.post("/api/trainings", requireAuth, async (req: Request, res: Response) => {
    try {
      const trainingData = insertTrainingSchema.parse(req.body);
      const training = await storage.createTraining(trainingData);
      return res.status(201).json(training);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid training data", 
          errors: error.errors 
        });
      }
      console.error("Error creating training:", error);
      return res.status(500).json({ message: "Failed to create training" });
    }
  });
  
  app.put("/api/trainings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingTraining = await storage.getTraining(id);
      if (!existingTraining) {
        return res.status(404).json({ message: "Training not found" });
      }
      
      const updatedTraining = await storage.updateTraining(id, req.body);
      return res.json(updatedTraining);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid training data", 
          errors: error.errors 
        });
      }
      console.error("Error updating training:", error);
      return res.status(500).json({ message: "Failed to update training" });
    }
  });
  
  app.delete("/api/trainings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingTraining = await storage.getTraining(id);
      if (!existingTraining) {
        return res.status(404).json({ message: "Training not found" });
      }
      
      await storage.deleteTraining(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting training:", error);
      return res.status(500).json({ message: "Failed to delete training" });
    }
  });

  // Section Settings endpoints
  app.get("/api/section-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSectionSettings();
      return res.json(settings);
    } catch (error) {
      console.error("Error fetching section settings:", error);
      return res.status(500).json({ message: "Failed to fetch section settings" });
    }
  });

  app.get("/api/section-settings/:key", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSectionSettingByKey(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Section setting not found" });
      }
      return res.json(setting);
    } catch (error) {
      console.error("Error fetching section setting:", error);
      return res.status(500).json({ message: "Failed to fetch section setting" });
    }
  });

  // Admin routes for section settings
  app.post("/api/section-settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const settingData = insertSectionSettingSchema.parse(req.body);
      
      // Check if key already exists
      const existingSetting = await storage.getSectionSettingByKey(settingData.sectionKey);
      if (existingSetting) {
        return res.status(400).json({ message: "Section key already exists" });
      }
      
      const setting = await storage.createSectionSetting(settingData);
      return res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid section setting data", 
          errors: error.errors 
        });
      }
      console.error("Error creating section setting:", error);
      return res.status(500).json({ message: "Failed to create section setting" });
    }
  });
  
  // Update section setting
  app.put("/api/section-settings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingSetting = await storage.getSectionSetting(id);
      if (!existingSetting) {
        return res.status(404).json({ message: "Section setting not found" });
      }
      
      // If sectionKey is changing, verify it doesn't conflict
      if (req.body.sectionKey && req.body.sectionKey !== existingSetting.sectionKey) {
        const settingWithKey = await storage.getSectionSettingByKey(req.body.sectionKey);
        if (settingWithKey && settingWithKey.id !== id) {
          return res.status(400).json({ message: "Section key already exists" });
        }
      }
      
      const updatedSetting = await storage.updateSectionSetting(id, req.body);
      return res.json(updatedSetting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid section setting data", 
          errors: error.errors 
        });
      }
      console.error("Error updating section setting:", error);
      return res.status(500).json({ message: "Failed to update section setting" });
    }
  });
  
  // Update section setting by key
  app.put("/api/section-settings/key/:key", requireAuth, async (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      
      const existingSetting = await storage.getSectionSettingByKey(key);
      if (!existingSetting) {
        return res.status(404).json({ message: "Section setting not found" });
      }
      
      const updatedSetting = await storage.updateSectionSettingByKey(key, req.body);
      return res.json(updatedSetting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid section setting data", 
          errors: error.errors 
        });
      }
      console.error("Error updating section setting:", error);
      return res.status(500).json({ message: "Failed to update section setting" });
    }
  });
  
  // Delete section setting
  app.delete("/api/section-settings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingSetting = await storage.getSectionSetting(id);
      if (!existingSetting) {
        return res.status(404).json({ message: "Section setting not found" });
      }
      
      await storage.deleteSectionSetting(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting section setting:", error);
      return res.status(500).json({ message: "Failed to delete section setting" });
    }
  });
  
  // Hero Settings endpoints
  app.get("/api/hero-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getHeroSettings();
      return res.json(settings);
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      return res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  app.get("/api/hero-settings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const setting = await storage.getHeroSetting(id);
      if (!setting) {
        return res.status(404).json({ message: "Hero setting not found" });
      }
      
      return res.json(setting);
    } catch (error) {
      console.error("Error fetching hero setting:", error);
      return res.status(500).json({ message: "Failed to fetch hero setting" });
    }
  });
  
  app.get("/api/hero-settings/page/:pageKey", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getHeroSettingByPageKey(req.params.pageKey);
      if (!setting) {
        return res.status(404).json({ message: "Hero setting not found for this page" });
      }
      
      return res.json(setting);
    } catch (error) {
      console.error("Error fetching hero setting by page key:", error);
      return res.status(500).json({ message: "Failed to fetch hero setting" });
    }
  });
  
  app.post("/api/hero-settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const settingData = insertHeroSettingSchema.parse(req.body);
      
      // Check if key already exists
      const existingSetting = await storage.getHeroSettingByPageKey(settingData.pageKey);
      if (existingSetting) {
        return res.status(400).json({ message: "Hero setting for this page already exists" });
      }
      
      const setting = await storage.createHeroSetting(settingData);
      return res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid hero setting data", 
          errors: error.errors 
        });
      }
      console.error("Error creating hero setting:", error);
      return res.status(500).json({ message: "Failed to create hero setting" });
    }
  });
  
  app.put("/api/hero-settings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingSetting = await storage.getHeroSetting(id);
      if (!existingSetting) {
        return res.status(404).json({ message: "Hero setting not found" });
      }
      
      // If pageKey is changing, verify it doesn't conflict
      if (req.body.pageKey && req.body.pageKey !== existingSetting.pageKey) {
        const settingWithPageKey = await storage.getHeroSettingByPageKey(req.body.pageKey);
        if (settingWithPageKey && settingWithPageKey.id !== id) {
          return res.status(400).json({ message: "Hero setting for this page already exists" });
        }
      }
      
      const updatedSetting = await storage.updateHeroSetting(id, req.body);
      return res.json(updatedSetting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid hero setting data", 
          errors: error.errors 
        });
      }
      console.error("Error updating hero setting:", error);
      return res.status(500).json({ message: "Failed to update hero setting" });
    }
  });
  
  app.delete("/api/hero-settings/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const existingSetting = await storage.getHeroSetting(id);
      if (!existingSetting) {
        return res.status(404).json({ message: "Hero setting not found" });
      }
      
      await storage.deleteHeroSetting(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting hero setting:", error);
      return res.status(500).json({ message: "Failed to delete hero setting" });
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

  // Password reset functionality
  
  // 1. Request password reset - sends token to user
  app.post("/api/admin/forgot-password", async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        // For security reasons, don't reveal if user exists
        return res.status(200).json({ 
          message: "If a user with that username exists, a password reset email has been sent." 
        });
      }
      
      // Generate reset token and set expiry date
      const { token, expiresAt } = generatePasswordResetToken();
      
      // Store token with user
      await storage.setPasswordResetToken(user.id, token, expiresAt);
      
      // Note: In a real application, we would send an email with the token,
      // but for this demo we'll just return the token in the response
      // In production, NEVER return the token in the response
      
      return res.status(200).json({ 
        message: "Password reset initiated. Check your email for instructions.",
        // Only for development/demo:
        token,
        expiresAt
      });
    } catch (error) {
      console.error("Error initiating password reset:", error);
      return res.status(500).json({ message: "Failed to initiate password reset" });
    }
  });
  
  // 2. Verify reset token before displaying reset form
  app.get("/api/admin/reset-password/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(404).json({ message: "Invalid or expired token" });
      }
      
      // Verify token is not expired
      if (!isResetTokenValid(user.resetTokenExpiresAt)) {
        return res.status(400).json({ message: "Token has expired" });
      }
      
      return res.status(200).json({ 
        message: "Token is valid",
        username: user.username
      });
    } catch (error) {
      console.error("Error verifying reset token:", error);
      return res.status(500).json({ message: "Failed to verify token" });
    }
  });
  
  // 3. Reset password with token
  app.post("/api/admin/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ 
          message: "Token and new password are required" 
        });
      }
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(404).json({ message: "Invalid or expired token" });
      }
      
      // Verify token is not expired
      if (!isResetTokenValid(user.resetTokenExpiresAt)) {
        return res.status(400).json({ message: "Token has expired" });
      }
      
      // Verify password strength
      if (!isPasswordStrong(newPassword)) {
        return res.status(400).json({ 
          message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character." 
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user password and clear reset token
      await storage.resetUserPassword(user.id, hashedPassword);
      
      return res.status(200).json({ 
        message: "Password successfully reset. You can now log in with your new password." 
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // 4. Change password (for logged in users)
  app.post("/api/admin/change-password", requireAuth, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.session.user!.id;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: "Current password and new password are required" 
        });
      }
      
      // Get user by ID
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Verify password strength
      if (!isPasswordStrong(newPassword)) {
        return res.status(400).json({ 
          message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character." 
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user password
      await storage.updateUserPassword(userId, hashedPassword);
      
      return res.status(200).json({ 
        message: "Password successfully changed." 
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ message: "Failed to change password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
