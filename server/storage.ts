import { 
  users, type User, type InsertUser,
  blogPosts, type BlogPost, type InsertBlogPost,
  templates, type Template, type InsertTemplate,
  caseStudies, type CaseStudy, type InsertCaseStudy,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getFeaturedBlogPosts(limit?: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplateBySlug(slug: string): Promise<Template | undefined>;
  getFeaturedTemplates(limit?: number): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Case Study methods
  getCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined>;
  getFeaturedCaseStudies(limit?: number): Promise<CaseStudy[]>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  
  // Contact form methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Newsletter methods
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private templates: Map<number, Template>;
  private caseStudies: Map<number, CaseStudy>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  
  private userCount: number;
  private blogPostCount: number;
  private templateCount: number;
  private caseStudyCount: number;
  private contactSubmissionCount: number;
  private newsletterSubscriberCount: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.templates = new Map();
    this.caseStudies = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscribers = new Map();
    
    this.userCount = 1;
    this.blogPostCount = 1;
    this.templateCount = 1;
    this.caseStudyCount = 1;
    this.contactSubmissionCount = 1;
    this.newsletterSubscriberCount = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCount++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }
  
  async getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCount++;
    const blogPost: BlogPost = { ...post, id };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  // Template methods
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }
  
  async getTemplateBySlug(slug: string): Promise<Template | undefined> {
    return Array.from(this.templates.values()).find(template => template.slug === slug);
  }
  
  async getFeaturedTemplates(limit = 3): Promise<Template[]> {
    return Array.from(this.templates.values())
      .filter(template => template.featured)
      .slice(0, limit);
  }
  
  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.templateCount++;
    const newTemplate: Template = { ...template, id };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }
  
  // Case Study methods
  async getCaseStudies(): Promise<CaseStudy[]> {
    return Array.from(this.caseStudies.values());
  }
  
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    return Array.from(this.caseStudies.values()).find(study => study.slug === slug);
  }
  
  async getFeaturedCaseStudies(limit = 3): Promise<CaseStudy[]> {
    return Array.from(this.caseStudies.values())
      .filter(study => study.featured)
      .slice(0, limit);
  }
  
  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const id = this.caseStudyCount++;
    const newCaseStudy: CaseStudy = { ...caseStudy, id };
    this.caseStudies.set(id, newCaseStudy);
    return newCaseStudy;
  }
  
  // Contact form methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.contactSubmissionCount++;
    const contactSubmission: ContactSubmission = { 
      ...submission, 
      id, 
      createdAt: new Date() 
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }
  
  // Newsletter methods
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.newsletterSubscribers.values())
      .find(sub => sub.email === subscriber.email);
      
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const id = this.newsletterSubscriberCount++;
    const newSubscriber: NewsletterSubscriber = { 
      ...subscriber, 
      id, 
      subscribedAt: new Date() 
    };
    this.newsletterSubscribers.set(id, newSubscriber);
    return newSubscriber;
  }
  
  // Initialize with sample data
  private initializeSampleData() {
    // Sample blog posts
    this.createBlogPost({
      title: "Jak zacząć z automatyzacją procesów w firmie?",
      slug: "jak-zaczac-z-automatyzacja-procesow-w-firmie",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vitae aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vitae aliquam nisl nisl sit amet nisl.",
      excerpt: "Praktyczny przewodnik dla firm, które chcą rozpocząć przygodę z automatyzacją i nie wiedzą od czego zacząć...",
      imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Poradnik",
      author: "Adam Nowak",
      authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
      readTime: 5,
      publishedAt: new Date("2023-05-23"),
      featured: true
    });
    
    this.createBlogPost({
      title: "Make.com vs Zapier - co wybrać w 2023 roku?",
      slug: "make-com-vs-zapier-co-wybrac-w-2023-roku",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vitae aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vitae aliquam nisl nisl sit amet nisl.",
      excerpt: "Szczegółowe porównanie dwóch najpopularniejszych platform do automatyzacji bez kodu. Które narzędzie wygrywa...",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Porównanie",
      author: "Monika Kowalska",
      authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      readTime: 8,
      publishedAt: new Date("2023-04-10"),
      featured: true
    });
    
    this.createBlogPost({
      title: "Modele LLM w automatyzacji procesów biznesowych",
      slug: "modele-llm-w-automatyzacji-procesow-biznesowych",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vitae aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vitae aliquam nisl nisl sit amet nisl.",
      excerpt: "Jak wykorzystać potencjał modeli językowych w automatyzacji procesów firmowych i budowie inteligentnych botów...",
      imageUrl: "https://images.unsplash.com/photo-1673187236949-3bbcd78e03a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "AI",
      author: "Piotr Wiśniewski",
      authorImage: "https://randomuser.me/api/portraits/men/67.jpg",
      readTime: 12,
      publishedAt: new Date("2023-03-02"),
      featured: true
    });
    
    // Sample templates
    this.createTemplate({
      title: "Automatyzacja sprzedaży",
      slug: "automatyzacja-sprzedazy",
      description: "Gotowy szablon do automatyzacji procesu sprzedaży i follow-up.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 29900, // in cents
      rating: 45, // out of 50
      reviewCount: 24,
      featured: true,
      isBestseller: true
    });
    
    this.createTemplate({
      title: "Integracja CRM",
      slug: "integracja-crm",
      description: "Połącz swój CRM z narzędziami marketingowymi i komunikacyjnymi.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 24900, // in cents
      rating: 40, // out of 50
      reviewCount: 18,
      featured: true,
      isBestseller: false
    });
    
    this.createTemplate({
      title: "Discord Bot",
      slug: "discord-bot",
      description: "Customizowany bot dla Discorda z funkcjami moderacji i automatyzacji.",
      imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 34900, // in cents
      rating: 50, // out of 50
      reviewCount: 12,
      featured: true,
      isBestseller: false
    });
    
    // Sample case studies
    this.createCaseStudy({
      title: "Automatyzacja e-commerce",
      slug: "automatyzacja-ecommerce",
      description: "Pełna automatyzacja procesów zamówień i wysyłek dla sklepu internetowego.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      tools: ["Make.com", "Shopify"],
      tags: ["e-commerce", "automatyzacja", "integracja"],
      featured: true
    });
    
    this.createCaseStudy({
      title: "Discord Bot dla startupu",
      slug: "discord-bot-dla-startupu",
      description: "Bot wspomagający onboarding użytkowników i automatyczne odpowiedzi na FAQ.",
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      tools: ["Bot", "Discord"],
      tags: ["bot", "discord", "startup"],
      featured: true
    });
    
    this.createCaseStudy({
      title: "Integracja CRM i Marketingu",
      slug: "integracja-crm-i-marketingu",
      description: "Połączenie systemów CRM z narzędziami marketingowymi dla agencji.",
      imageUrl: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      tools: ["Zapier", "HubSpot"],
      tags: ["crm", "marketing", "integracja"],
      featured: true
    });
  }
}

export const storage = new MemStorage();
