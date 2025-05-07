import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema (keep existing user model)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Blog posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorImage: text("author_image"),
  readTime: integer("read_time").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  featured: boolean("featured").default(false),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

// Templates/Products schema
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  price: integer("price").notNull(),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  featured: boolean("featured").default(false),
  isBestseller: boolean("is_bestseller").default(false),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

// Case studies/Portfolio schema
export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  tools: text("tools").array(),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
});

// Contact form submissions schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

// Newsletter subscribers schema
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
});

// Dlaczego Automatyzator? (Why Us) schema
export const whyUsItems = pgTable("why_us_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  language: text("language").notNull().default("pl"),
});

export const insertWhyUsItemSchema = createInsertSchema(whyUsItems).omit({
  id: true,
  updatedAt: true,
});

// Nasze usługi (Our Services) schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  language: text("language").notNull().default("pl"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  updatedAt: true,
});

// Type exports for all schemas
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactMessage = ContactSubmission; // Alias dla kompatybilności z kodem w panelu administracyjnym

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type WhyUsItem = typeof whyUsItems.$inferSelect;
export type InsertWhyUsItem = z.infer<typeof insertWhyUsItemSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

// Ustawienia sekcji (Section Settings) schema
export const sectionSettings = pgTable("section_settings", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  displayName: text("display_name").notNull(),
  isEnabled: boolean("is_enabled").notNull().default(true),
  showInMenu: boolean("show_in_menu").notNull().default(true),
  order: integer("order").notNull().default(0),
  metadata: text("metadata"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSectionSettingSchema = createInsertSchema(sectionSettings).omit({
  id: true,
  updatedAt: true,
});

export type SectionSetting = typeof sectionSettings.$inferSelect;
export type InsertSectionSetting = z.infer<typeof insertSectionSettingSchema>;
