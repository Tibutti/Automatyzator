import { 
  users, type User, type InsertUser,
  blogPosts, type BlogPost, type InsertBlogPost,
  templates, type Template, type InsertTemplate,
  caseStudies, type CaseStudy, type InsertCaseStudy,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  whyUsItems, type WhyUsItem, type InsertWhyUsItem,
  services, type Service, type InsertService,
  trainings, type Training, type InsertTraining,
  sectionSettings, type SectionSetting, type InsertSectionSetting
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getFeaturedBlogPosts(limit?: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplateBySlug(slug: string): Promise<Template | undefined>;
  getFeaturedTemplates(limit?: number): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: number): Promise<void>;
  
  // Case Study methods
  getCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(id: number): Promise<CaseStudy | undefined>;
  getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined>;
  getFeaturedCaseStudies(limit?: number): Promise<CaseStudy[]>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: number, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy>;
  deleteCaseStudy(id: number): Promise<void>;
  
  // Contact form methods
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  deleteContactSubmission(id: number): Promise<void>;
  
  // Newsletter methods
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  deleteNewsletterSubscriber(id: number): Promise<void>;

  // "Dlaczego Automatyzator?" (Why Us) methods
  getWhyUsItems(language?: string): Promise<WhyUsItem[]>;
  getWhyUsItem(id: number): Promise<WhyUsItem | undefined>;
  createWhyUsItem(item: InsertWhyUsItem): Promise<WhyUsItem>;
  updateWhyUsItem(id: number, item: Partial<InsertWhyUsItem>): Promise<WhyUsItem>;
  deleteWhyUsItem(id: number): Promise<void>;
  
  // "Nasze usługi" (Services) methods
  getServices(language?: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  
  // Szkolenia (Trainings) methods
  getTrainings(language?: string): Promise<Training[]>;
  getTraining(id: number): Promise<Training | undefined>;
  getFeaturedTrainings(limit?: number): Promise<Training[]>;
  createTraining(training: InsertTraining): Promise<Training>;
  updateTraining(id: number, training: Partial<InsertTraining>): Promise<Training>;
  deleteTraining(id: number): Promise<void>;

  // Section Settings methods
  getSectionSettings(): Promise<SectionSetting[]>;
  getSectionSetting(id: number): Promise<SectionSetting | undefined>;
  getSectionSettingByKey(key: string): Promise<SectionSetting | undefined>;
  createSectionSetting(setting: InsertSectionSetting): Promise<SectionSetting>;
  updateSectionSetting(id: number, setting: Partial<InsertSectionSetting>): Promise<SectionSetting>;
  updateSectionSettingByKey(key: string, setting: Partial<InsertSectionSetting>): Promise<SectionSetting | undefined>;
  deleteSectionSetting(id: number): Promise<void>;
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
    return db.select()
      .from(blogPosts)
      .where(eq(blogPosts.featured, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db.insert(blogPosts).values(post).returning();
    return blogPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [blogPost] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return blogPost;
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  
  // Template methods
  async getTemplates(): Promise<Template[]> {
    return db.select().from(templates);
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }
  
  async getTemplateBySlug(slug: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    return template;
  }
  
  async getFeaturedTemplates(limit = 3): Promise<Template[]> {
    return db.select()
      .from(templates)
      .where(eq(templates.featured, true))
      .limit(limit);
  }
  
  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(templates).values(template).returning();
    return newTemplate;
  }
  
  async updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template> {
    const [updatedTemplate] = await db
      .update(templates)
      .set(template)
      .where(eq(templates.id, id))
      .returning();
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }
  
  // Case Study methods
  async getCaseStudies(): Promise<CaseStudy[]> {
    return db.select().from(caseStudies);
  }
  
  async getCaseStudy(id: number): Promise<CaseStudy | undefined> {
    const [study] = await db.select().from(caseStudies).where(eq(caseStudies.id, id));
    return study;
  }
  
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    const [study] = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug));
    return study;
  }
  
  async getFeaturedCaseStudies(limit = 3): Promise<CaseStudy[]> {
    return db.select()
      .from(caseStudies)
      .where(eq(caseStudies.featured, true))
      .limit(limit);
  }
  
  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const [newCaseStudy] = await db.insert(caseStudies).values(caseStudy).returning();
    return newCaseStudy;
  }
  
  async updateCaseStudy(id: number, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const [updatedCaseStudy] = await db
      .update(caseStudies)
      .set(caseStudy)
      .where(eq(caseStudies.id, id))
      .returning();
    return updatedCaseStudy;
  }
  
  async deleteCaseStudy(id: number): Promise<void> {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  }
  
  // Contact form methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }
  
  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id));
    return submission;
  }
  
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [contactSubmission] = await db.insert(contactSubmissions)
      .values({
        ...submission,
        createdAt: new Date()
      })
      .returning();
    return contactSubmission;
  }
  
  async deleteContactSubmission(id: number): Promise<void> {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  }
  
  // Newsletter methods
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return db.select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.subscribedAt));
  }
  
  async getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, id));
    return subscriber;
  }
  
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    // Check if email already exists
    const [existingSubscriber] = await db.select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, subscriber.email));
      
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const [newSubscriber] = await db.insert(newsletterSubscribers)
      .values({
        ...subscriber,
        subscribedAt: new Date()
      })
      .returning();
    return newSubscriber;
  }
  
  async deleteNewsletterSubscriber(id: number): Promise<void> {
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
  }
  
  // "Dlaczego Automatyzator?" (Why Us) methods
  async getWhyUsItems(language = "pl"): Promise<WhyUsItem[]> {
    return db.select()
      .from(whyUsItems)
      .where(eq(whyUsItems.language, language))
      .orderBy(asc(whyUsItems.order));
  }
  
  async getWhyUsItem(id: number): Promise<WhyUsItem | undefined> {
    const [item] = await db.select()
      .from(whyUsItems)
      .where(eq(whyUsItems.id, id));
    return item;
  }
  
  async createWhyUsItem(item: InsertWhyUsItem): Promise<WhyUsItem> {
    const [whyUsItem] = await db.insert(whyUsItems)
      .values({
        ...item,
        updatedAt: new Date()
      })
      .returning();
    return whyUsItem;
  }
  
  async updateWhyUsItem(id: number, item: Partial<InsertWhyUsItem>): Promise<WhyUsItem> {
    const [updatedItem] = await db
      .update(whyUsItems)
      .set({
        ...item,
        updatedAt: new Date()
      })
      .where(eq(whyUsItems.id, id))
      .returning();
    return updatedItem;
  }
  
  async deleteWhyUsItem(id: number): Promise<void> {
    await db.delete(whyUsItems).where(eq(whyUsItems.id, id));
  }
  
  // "Nasze usługi" (Services) methods
  async getServices(language = "pl"): Promise<Service[]> {
    return db.select()
      .from(services)
      .where(eq(services.language, language))
      .orderBy(asc(services.order));
  }
  
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }
  
  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services)
      .values({
        ...service,
        updatedAt: new Date()
      })
      .returning();
    return newService;
  }
  
  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({
        ...service,
        updatedAt: new Date()
      })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }
  
  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }
  
  // Szkolenia (Trainings) methods
  async getTrainings(language = "pl"): Promise<Training[]> {
    return db.select()
      .from(trainings)
      .where(eq(trainings.language, language))
      .orderBy(asc(trainings.order));
  }
  
  async getTraining(id: number): Promise<Training | undefined> {
    const [training] = await db.select()
      .from(trainings)
      .where(eq(trainings.id, id));
    return training;
  }
  
  async getFeaturedTrainings(limit = 3): Promise<Training[]> {
    return db.select()
      .from(trainings)
      .where(eq(trainings.featured, true))
      .orderBy(asc(trainings.order))
      .limit(limit);
  }
  
  async createTraining(training: InsertTraining): Promise<Training> {
    const [newTraining] = await db.insert(trainings)
      .values({
        ...training,
        updatedAt: new Date()
      })
      .returning();
    return newTraining;
  }
  
  async updateTraining(id: number, training: Partial<InsertTraining>): Promise<Training> {
    const [updatedTraining] = await db
      .update(trainings)
      .set({
        ...training,
        updatedAt: new Date()
      })
      .where(eq(trainings.id, id))
      .returning();
    return updatedTraining;
  }
  
  async deleteTraining(id: number): Promise<void> {
    await db.delete(trainings).where(eq(trainings.id, id));
  }
  
  // Section Settings methods
  async getSectionSettings(): Promise<SectionSetting[]> {
    return db.select()
      .from(sectionSettings)
      .orderBy(asc(sectionSettings.order));
  }
  
  async getSectionSetting(id: number): Promise<SectionSetting | undefined> {
    const [setting] = await db.select()
      .from(sectionSettings)
      .where(eq(sectionSettings.id, id));
    return setting;
  }
  
  async getSectionSettingByKey(key: string): Promise<SectionSetting | undefined> {
    const [setting] = await db.select()
      .from(sectionSettings)
      .where(eq(sectionSettings.sectionKey, key));
    return setting;
  }
  
  async createSectionSetting(setting: InsertSectionSetting): Promise<SectionSetting> {
    const [newSetting] = await db.insert(sectionSettings)
      .values({
        ...setting,
        updatedAt: new Date()
      })
      .returning();
    return newSetting;
  }
  
  async updateSectionSetting(id: number, setting: Partial<InsertSectionSetting>): Promise<SectionSetting> {
    const [updatedSetting] = await db
      .update(sectionSettings)
      .set({
        ...setting,
        updatedAt: new Date()
      })
      .where(eq(sectionSettings.id, id))
      .returning();
    return updatedSetting;
  }
  
  async updateSectionSettingByKey(key: string, setting: Partial<InsertSectionSetting>): Promise<SectionSetting | undefined> {
    const [updatedSetting] = await db
      .update(sectionSettings)
      .set({
        ...setting,
        updatedAt: new Date()
      })
      .where(eq(sectionSettings.sectionKey, key))
      .returning();
    return updatedSetting;
  }
  
  async deleteSectionSetting(id: number): Promise<void> {
    await db.delete(sectionSettings).where(eq(sectionSettings.id, id));
  }
  
  // Initialize sample data if database is empty
  async initializeSampleData() {
    // Check if we already have blog posts
    const existingPosts = await db.select().from(blogPosts).limit(1);
    if (existingPosts.length > 0) return;
    
    // Sample Why Us items
    await db.insert(whyUsItems).values([
      {
        title: "Oszczędność czasu",
        description: "Automatyzacja rutynowych zadań pozwala zaoszczędzić nawet 60% czasu pracy.",
        icon: "clock",
        order: 1,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "Eliminacja błędów",
        description: "Zautomatyzowane procesy redukują liczbę błędów ludzkich o ponad 90%.",
        icon: "shield-check",
        order: 2,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "Zwiększenie wydajności",
        description: "Nasi klienci notują średnio 40% wzrost wydajności operacyjnej.",
        icon: "trending-up",
        order: 3,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "Skalowalność",
        description: "Łatwe skalowanie procesów biznesowych bez zwiększania zatrudnienia.",
        icon: "layers",
        order: 4,
        language: "pl",
        updatedAt: new Date()
      }
    ]);
    
    // Sample Services
    await db.insert(services).values([
      {
        title: "Analiza AI",
        description: "Wykorzystujemy sztuczną inteligencję do analizy procesów i identyfikacji obszarów do automatyzacji.",
        icon: "brain",
        order: 1,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "Automatyzacja procesów",
        description: "Tworzymy zautomatyzowane przepływy pracy dla powtarzalnych zadań biznesowych.",
        icon: "settings",
        order: 2,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "Agenty AI",
        description: "Implementujemy inteligentnych asystentów opartych o najnowsze modele językowe.",
        icon: "bot",
        order: 3,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "API i integracje",
        description: "Łączymy różne systemy i aplikacje w jeden spójny ekosystem.",
        icon: "plug",
        order: 4,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "Analiza danych",
        description: "Pomagamy w ekstrakcji wartościowych informacji z danych biznesowych.",
        icon: "bar-chart",
        order: 5,
        language: "pl",
        updatedAt: new Date()
      },
      {
        title: "Integracje systemów",
        description: "Eliminujemy silosy informacyjne, łącząc wszystkie systemy firmowe.",
        icon: "layers",
        order: 6,
        language: "pl",
        updatedAt: new Date()
      }
    ]);
    
    // Sample blog posts
    await db.insert(blogPosts).values([
      {
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
      },
      {
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
      },
      {
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
      }
    ] as any[]);
    
    // Sample templates
    await db.insert(templates).values([
      {
        title: "Automatyzacja sprzedaży",
        slug: "automatyzacja-sprzedazy",
        description: "Gotowy szablon do automatyzacji procesu sprzedaży i follow-up.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 29900, // in cents
        rating: 45, // out of 50
        reviewCount: 24,
        featured: true,
        isBestseller: true
      },
      {
        title: "Integracja CRM",
        slug: "integracja-crm",
        description: "Połącz swój CRM z narzędziami marketingowymi i komunikacyjnymi.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 24900, // in cents
        rating: 40, // out of 50
        reviewCount: 18,
        featured: true,
        isBestseller: false
      },
      {
        title: "Discord Bot",
        slug: "discord-bot",
        description: "Customizowany bot dla Discorda z funkcjami moderacji i automatyzacji.",
        imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 34900, // in cents
        rating: 50, // out of 50
        reviewCount: 12,
        featured: true,
        isBestseller: false
      }
    ] as any[]);
    
    // Sample case studies
    await db.insert(caseStudies).values([
      {
        title: "Automatyzacja e-commerce",
        slug: "automatyzacja-ecommerce",
        description: "Pełna automatyzacja procesów zamówień i wysyłek dla sklepu internetowego.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tools: ["Make.com", "Shopify"],
        tags: ["e-commerce", "automatyzacja", "integracja"],
        featured: true
      },
      {
        title: "Discord Bot dla startupu",
        slug: "discord-bot-dla-startupu",
        description: "Bot wspomagający onboarding użytkowników i automatyczne odpowiedzi na FAQ.",
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tools: ["Bot", "Discord"],
        tags: ["bot", "discord", "startup"],
        featured: true
      },
      {
        title: "Integracja CRM i Marketingu",
        slug: "integracja-crm-i-marketingu",
        description: "Połączenie systemów CRM z narzędziami marketingowymi dla agencji.",
        imageUrl: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tools: ["Zapier", "HubSpot"],
        tags: ["crm", "marketing", "integracja"],
        featured: true
      }
    ] as any[]);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private templates: Map<number, Template>;
  private caseStudies: Map<number, CaseStudy>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  private whyUsItems: Map<number, WhyUsItem>;
  private services: Map<number, Service>;
  private trainings: Map<number, Training>;
  private sectionSettings: Map<number, SectionSetting>;
  
  private userCount: number;
  private blogPostCount: number;
  private templateCount: number;
  private caseStudyCount: number;
  private contactSubmissionCount: number;
  private newsletterSubscriberCount: number;
  private whyUsItemCount: number;
  private serviceCount: number;
  private trainingCount: number;
  private sectionSettingCount: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.templates = new Map();
    this.caseStudies = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscribers = new Map();
    this.whyUsItems = new Map();
    this.services = new Map();
    this.trainings = new Map();
    this.sectionSettings = new Map();
    
    this.userCount = 1;
    this.blogPostCount = 1;
    this.templateCount = 1;
    this.caseStudyCount = 1;
    this.contactSubmissionCount = 1;
    this.newsletterSubscriberCount = 1;
    this.whyUsItemCount = 1;
    this.serviceCount = 1;
    this.trainingCount = 1;
    this.sectionSettingCount = 1;
    
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
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
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
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    
    const updatedPost = { ...existingPost, ...post };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }
  
  // Template methods
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
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
  
  async updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template> {
    const existingTemplate = this.templates.get(id);
    if (!existingTemplate) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    const updatedTemplate = { ...existingTemplate, ...template };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<void> {
    this.templates.delete(id);
  }
  
  // Case Study methods
  async getCaseStudies(): Promise<CaseStudy[]> {
    return Array.from(this.caseStudies.values());
  }
  
  async getCaseStudy(id: number): Promise<CaseStudy | undefined> {
    return this.caseStudies.get(id);
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
  
  async updateCaseStudy(id: number, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const existingStudy = this.caseStudies.get(id);
    if (!existingStudy) {
      throw new Error(`Case study with id ${id} not found`);
    }
    
    const updatedStudy = { ...existingStudy, ...caseStudy };
    this.caseStudies.set(id, updatedStudy);
    return updatedStudy;
  }
  
  async deleteCaseStudy(id: number): Promise<void> {
    this.caseStudies.delete(id);
  }
  
  // Contact form methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    return this.contactSubmissions.get(id);
  }
  
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
  
  async deleteContactSubmission(id: number): Promise<void> {
    this.contactSubmissions.delete(id);
  }
  
  // Newsletter methods
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values())
      .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
  }
  
  async getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined> {
    return this.newsletterSubscribers.get(id);
  }
  
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
  
  async deleteNewsletterSubscriber(id: number): Promise<void> {
    this.newsletterSubscribers.delete(id);
  }
  
  // "Dlaczego Automatyzator?" (Why Us) methods
  async getWhyUsItems(language = "pl"): Promise<WhyUsItem[]> {
    return Array.from(this.whyUsItems.values())
      .filter(item => item.language === language)
      .sort((a, b) => a.order - b.order);
  }
  
  async getWhyUsItem(id: number): Promise<WhyUsItem | undefined> {
    return this.whyUsItems.get(id);
  }
  
  async createWhyUsItem(item: InsertWhyUsItem): Promise<WhyUsItem> {
    const id = this.whyUsItemCount++;
    const whyUsItem: WhyUsItem = { 
      ...item, 
      id, 
      updatedAt: new Date() 
    };
    this.whyUsItems.set(id, whyUsItem);
    return whyUsItem;
  }
  
  async updateWhyUsItem(id: number, item: Partial<InsertWhyUsItem>): Promise<WhyUsItem> {
    const existingItem = this.whyUsItems.get(id);
    if (!existingItem) {
      throw new Error(`Why Us item with id ${id} not found`);
    }
    
    const updatedItem: WhyUsItem = { 
      ...existingItem, 
      ...item, 
      updatedAt: new Date() 
    };
    this.whyUsItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteWhyUsItem(id: number): Promise<void> {
    this.whyUsItems.delete(id);
  }
  
  // "Nasze usługi" (Services) methods
  async getServices(language = "pl"): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(service => service.language === language)
      .sort((a, b) => a.order - b.order);
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceCount++;
    const newService: Service = { 
      ...service, 
      id, 
      updatedAt: new Date() 
    };
    this.services.set(id, newService);
    return newService;
  }
  
  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const existingService = this.services.get(id);
    if (!existingService) {
      throw new Error(`Service with id ${id} not found`);
    }
    
    const updatedService: Service = { 
      ...existingService, 
      ...service, 
      updatedAt: new Date() 
    };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<void> {
    this.services.delete(id);
  }
  
  // Szkolenia (Trainings) methods
  async getTrainings(language = "pl"): Promise<Training[]> {
    return Array.from(this.trainings.values())
      .filter(training => training.language === language)
      .sort((a, b) => a.order - b.order);
  }
  
  async getTraining(id: number): Promise<Training | undefined> {
    return this.trainings.get(id);
  }
  
  async getFeaturedTrainings(limit = 3): Promise<Training[]> {
    return Array.from(this.trainings.values())
      .filter(training => training.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit);
  }
  
  async createTraining(training: InsertTraining): Promise<Training> {
    const id = this.trainingCount++;
    const newTraining: Training = { 
      ...training, 
      id, 
      updatedAt: new Date() 
    };
    this.trainings.set(id, newTraining);
    return newTraining;
  }
  
  async updateTraining(id: number, training: Partial<InsertTraining>): Promise<Training> {
    const existingTraining = this.trainings.get(id);
    if (!existingTraining) {
      throw new Error(`Training with id ${id} not found`);
    }
    
    const updatedTraining: Training = { 
      ...existingTraining, 
      ...training, 
      updatedAt: new Date() 
    };
    this.trainings.set(id, updatedTraining);
    return updatedTraining;
  }
  
  async deleteTraining(id: number): Promise<void> {
    this.trainings.delete(id);
  }

  // Section Settings methods
  async getSectionSettings(): Promise<SectionSetting[]> {
    return Array.from(this.sectionSettings.values())
      .sort((a, b) => a.order - b.order);
  }
  
  async getSectionSetting(id: number): Promise<SectionSetting | undefined> {
    return this.sectionSettings.get(id);
  }
  
  async getSectionSettingByKey(key: string): Promise<SectionSetting | undefined> {
    return Array.from(this.sectionSettings.values())
      .find(setting => setting.sectionKey === key);
  }
  
  async createSectionSetting(setting: InsertSectionSetting): Promise<SectionSetting> {
    const id = this.sectionSettingCount++;
    const newSetting: SectionSetting = { 
      ...setting, 
      id, 
      updatedAt: new Date() 
    };
    this.sectionSettings.set(id, newSetting);
    return newSetting;
  }
  
  async updateSectionSetting(id: number, setting: Partial<InsertSectionSetting>): Promise<SectionSetting> {
    const existingSetting = this.sectionSettings.get(id);
    if (!existingSetting) {
      throw new Error(`Section setting with id ${id} not found`);
    }
    
    const updatedSetting: SectionSetting = { 
      ...existingSetting, 
      ...setting, 
      updatedAt: new Date() 
    };
    this.sectionSettings.set(id, updatedSetting);
    return updatedSetting;
  }
  
  async updateSectionSettingByKey(key: string, setting: Partial<InsertSectionSetting>): Promise<SectionSetting | undefined> {
    const existingSetting = Array.from(this.sectionSettings.values())
      .find(s => s.sectionKey === key);
      
    if (!existingSetting) return undefined;
    
    const updatedSetting: SectionSetting = { 
      ...existingSetting, 
      ...setting, 
      updatedAt: new Date() 
    };
    this.sectionSettings.set(existingSetting.id, updatedSetting);
    return updatedSetting;
  }
  
  async deleteSectionSetting(id: number): Promise<void> {
    this.sectionSettings.delete(id);
  }
  
  // Initialize with sample data
  private initializeSampleData() {
    // Initialize section settings if not exists
    this.createSectionSetting({
      sectionKey: "services",
      displayName: "Nasze usługi",
      isEnabled: true,
      order: 1
    });
    
    this.createSectionSetting({
      sectionKey: "why-us",
      displayName: "Dlaczego Automatyzator?",
      isEnabled: true,
      order: 2
    });
    
    this.createSectionSetting({
      sectionKey: "case-studies",
      displayName: "Nasze wdrożenia",
      isEnabled: true,
      order: 3
    });
    
    this.createSectionSetting({
      sectionKey: "templates",
      displayName: "Szablony automatyzacji",
      isEnabled: true,
      order: 4
    });
    
    this.createSectionSetting({
      sectionKey: "trainings",
      displayName: "Szkolenia",
      isEnabled: true,
      order: 5
    });
    
    this.createSectionSetting({
      sectionKey: "blog",
      displayName: "Blog",
      isEnabled: true,
      order: 6
    });
    
    this.createSectionSetting({
      sectionKey: "shop",
      displayName: "Sklep",
      isEnabled: true,
      order: 7
    });
    
    // Sample Why Us items
    this.createWhyUsItem({
      title: "Oszczędność czasu",
      description: "Automatyzacja rutynowych zadań pozwala zaoszczędzić nawet 60% czasu pracy.",
      icon: "clock",
      order: 1,
      language: "pl"
    });
    
    this.createWhyUsItem({
      title: "Eliminacja błędów",
      description: "Zautomatyzowane procesy redukują liczbę błędów ludzkich o ponad 90%.",
      icon: "shield-check",
      order: 2,
      language: "pl"
    });
    
    this.createWhyUsItem({
      title: "Zwiększenie wydajności",
      description: "Nasi klienci notują średnio 40% wzrost wydajności operacyjnej.",
      icon: "trending-up",
      order: 3,
      language: "pl"
    });
    
    this.createWhyUsItem({
      title: "Skalowalność",
      description: "Łatwe skalowanie procesów biznesowych bez zwiększania zatrudnienia.",
      icon: "layers",
      order: 4,
      language: "pl"
    });
    
    // Sample Services
    this.createService({
      title: "Analiza AI",
      description: "Wykorzystujemy sztuczną inteligencję do analizy procesów i identyfikacji obszarów do automatyzacji.",
      icon: "brain",
      order: 1,
      language: "pl"
    });
    
    this.createService({
      title: "Automatyzacja procesów",
      description: "Tworzymy zautomatyzowane przepływy pracy dla powtarzalnych zadań biznesowych.",
      icon: "settings",
      order: 2,
      language: "pl"
    });
    
    this.createService({
      title: "Agenty AI",
      description: "Implementujemy inteligentnych asystentów opartych o najnowsze modele językowe.",
      icon: "bot",
      order: 3,
      language: "pl"
    });
    
    this.createService({
      title: "API i integracje",
      description: "Łączymy różne systemy i aplikacje w jeden spójny ekosystem.",
      icon: "plug",
      order: 4,
      language: "pl"
    });
    
    this.createService({
      title: "Analiza danych",
      description: "Pomagamy w ekstrakcji wartościowych informacji z danych biznesowych.",
      icon: "bar-chart",
      order: 5,
      language: "pl"
    });
    
    this.createService({
      title: "Integracje systemów",
      description: "Eliminujemy silosy informacyjne, łącząc wszystkie systemy firmowe.",
      icon: "layers",
      order: 6,
      language: "pl"
    });
    
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
    
    // Sample Trainings
    this.createTraining({
      title: "Automatyzacja procesów biznesowych bez kodu",
      description: "Intensywne szkolenie praktyczne z wykorzystania narzędzi no-code do automatyzacji procesów biznesowych. Poznaj platformy takie jak Make.com, Zapier i Airtable.",
      price: 149900, // 1499 PLN
      duration: "2 dni (16h)",
      level: "Podstawowy/Średni",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 1,
      language: "pl"
    });
    
    this.createTraining({
      title: "Budowa botów i asystentów AI",
      description: "Warsztat praktyczny z tworzenia inteligentnych chatbotów i asystentów wykorzystujących najnowsze modele językowe OpenAI i Anthropic dla firm.",
      price: 199900, // 1999 PLN
      duration: "3 dni (24h)",
      level: "Średni",
      imageUrl: "https://images.unsplash.com/photo-1677695016583-14c18821a95e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 2,
      language: "pl"
    });
    
    this.createTraining({
      title: "Integracja systemów biznesowych",
      description: "Szkolenie dla działów IT i specjalistów ds. procesów o integracji różnych systemów biznesowych w firmie: CRM, ERP, marketing, księgowość, logistyka.",
      price: 249900, // 2499 PLN
      duration: "4 dni (32h)",
      level: "Zaawansowany",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 3,
      language: "pl"
    });
    
    this.createTraining({
      title: "Microsoft Power Automate dla biznesu",
      description: "Kompleksowe szkolenie z wykorzystania platformy Microsoft Power Automate (dawniej Flow) do automatyzacji procesów w organizacji wykorzystującej rozwiązania Microsoft 365.",
      price: 129900, // 1299 PLN
      duration: "2 dni (16h)",
      level: "Podstawowy",
      imageUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: false,
      order: 4,
      language: "pl"
    });
    
    // English versions of the trainings
    this.createTraining({
      title: "No-code Business Process Automation",
      description: "Intensive practical training on using no-code tools for business process automation. Learn platforms such as Make.com, Zapier, and Airtable.",
      price: 149900, // 1499 PLN
      duration: "2 days (16h)",
      level: "Basic/Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 1,
      language: "en"
    });
    
    this.createTraining({
      title: "Building AI Bots and Assistants",
      description: "Practical workshop on creating intelligent chatbots and assistants using the latest language models from OpenAI and Anthropic for businesses.",
      price: 199900, // 1999 PLN
      duration: "3 days (24h)",
      level: "Intermediate",
      imageUrl: "https://images.unsplash.com/photo-1677695016583-14c18821a95e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 2,
      language: "en"
    });
    
    this.createTraining({
      title: "Business Systems Integration",
      description: "Training for IT departments and process specialists on integrating various business systems in the company: CRM, ERP, marketing, accounting, logistics.",
      price: 249900, // 2499 PLN
      duration: "4 days (32h)",
      level: "Advanced",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 3,
      language: "en"
    });
  }
}

export const storage = new DatabaseStorage();

// Initialize sample data
(async () => {
  try {
    await (storage as DatabaseStorage).initializeSampleData();
    console.log("Database initialized with sample data if needed");
  } catch (error) {
    console.error("Error initializing database with sample data:", error);
  }
})();
