import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

// Reusable walidatory dla często używanych pól

// Schemat walidacji dla zapytań czatu
export const chatQuerySchema = z.object({
  message: z.string()
    .min(1, "Wiadomość nie może być pusta")
    .max(500, "Wiadomość nie może przekraczać 500 znaków")
    .transform(val => DOMPurify.sanitize(val.trim())),
  language: z.enum(['pl', 'en', 'de', 'ko']).default('pl')
});
export const usernameSchema = z.string()
  .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki")
  .max(50, "Nazwa użytkownika nie może przekraczać 50 znaków")
  .regex(/^[a-zA-Z0-9_]+$/, "Nazwa użytkownika może zawierać tylko litery, cyfry i znaki podkreślenia");

export const passwordSchema = z.string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków")
  .max(100, "Hasło nie może przekraczać 100 znaków")
  .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
  .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę")
  .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
  .regex(/[^a-zA-Z0-9]/, "Hasło musi zawierać co najmniej jeden znak specjalny");

export const emailSchema = z.string()
  .email("Nieprawidłowy format adresu email")
  .max(255, "Email nie może przekraczać 255 znaków");

export const titleSchema = z.string()
  .min(3, "Tytuł musi mieć co najmniej 3 znaki")
  .max(100, "Tytuł nie może przekraczać 100 znaków");

export const slugSchema = z.string()
  .min(3, "Slug musi mieć co najmniej 3 znaki")
  .max(100, "Slug nie może przekraczać 100 znaków")
  .regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki");

export const contentSchema = z.string()
  .min(10, "Treść musi mieć co najmniej 10 znaków");

export const positiveNumberSchema = z.number()
  .positive("Wartość musi być dodatnia");

export const positiveIntegerSchema = z.number()
  .int("Wartość musi być liczbą całkowitą")
  .positive("Wartość musi być dodatnia");

export const booleanSchema = z.boolean();

export const orderSchema = z.number()
  .int("Kolejność musi być liczbą całkowitą")
  .min(0, "Kolejność musi być liczbą nieujemną");

export const keySchema = z.string()
  .min(2, "Klucz musi mieć co najmniej 2 znaki")
  .max(50, "Klucz nie może przekraczać 50 znaków")
  .regex(/^[a-z0-9-]+$/, "Klucz może zawierać tylko małe litery, cyfry i myślniki");

// Schematy walidacji dla konkretnych obiektów
export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const resetPasswordRequestSchema = z.object({
  username: usernameSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token jest wymagany"),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Hasła muszą być identyczne",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Aktualne hasło jest wymagane"),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Hasła muszą być identyczne",
  path: ["confirmPassword"],
});

export const contactSubmissionSchema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki").max(100, "Imię nie może przekraczać 100 znaków"),
  email: emailSchema,
  company: z.string().max(100, "Nazwa firmy nie może przekraczać 100 znaków").optional(),
  message: z.string().min(10, "Wiadomość musi mieć co najmniej 10 znaków").max(2000, "Wiadomość nie może przekraczać 2000 znaków"),
});

export const newsletterSubscriptionSchema = z.object({
  email: emailSchema,
  name: z.string().max(100, "Imię nie może przekraczać 100 znaków").optional(),
});

export const blogPostSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  content: contentSchema,
  excerpt: z.string().min(10, "Fragment musi mieć co najmniej 10 znaków").max(300, "Fragment nie może przekraczać 300 znaków"),
  category: z.string().min(1, "Kategoria jest wymagana").max(50, "Kategoria nie może przekraczać 50 znaków"),
  author: z.string().min(2, "Autor musi mieć co najmniej 2 znaki").max(100, "Autor nie może przekraczać 100 znaków"),
  readTime: positiveIntegerSchema,
  imageUrl: z.string().url("Nieprawidłowy format URL").optional().nullable(),
  authorImage: z.string().url("Nieprawidłowy format URL").optional().nullable(),
  featured: booleanSchema.optional().nullable(),
});

export const templateSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").max(500, "Opis nie może przekraczać 500 znaków"),
  price: z.number().nonnegative("Cena musi być nieujemna"),
  rating: z.number().min(0, "Ocena musi być nieujemna").max(5, "Ocena musi być nie większa niż 5"),
  reviewCount: z.number().int("Liczba recenzji musi być liczbą całkowitą").nonnegative("Liczba recenzji musi być nieujemna"),
  imageUrl: z.string().url("Nieprawidłowy format URL").optional().nullable(),
  featured: booleanSchema.optional().nullable(),
  isBestseller: booleanSchema.optional().nullable(),
});

export const caseStudySchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").max(500, "Opis nie może przekraczać 500 znaków"),
  imageUrl: z.string().url("Nieprawidłowy format URL").optional().nullable(),
  featured: booleanSchema.optional().nullable(),
  tools: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

export const whyUsItemSchema = z.object({
  title: titleSchema,
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").max(500, "Opis nie może przekraczać 500 znaków"),
  icon: z.string().min(1, "Ikona jest wymagana"),
  order: orderSchema.optional(),
  language: z.string().min(2, "Kod języka musi mieć co najmniej 2 znaki").max(5, "Kod języka nie może przekraczać 5 znaków").optional(),
});

export const serviceSchema = z.object({
  title: titleSchema,
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").max(500, "Opis nie może przekraczać 500 znaków"),
  icon: z.string().min(1, "Ikona jest wymagana"),
  order: orderSchema.optional(),
  language: z.string().min(2, "Kod języka musi mieć co najmniej 2 znaki").max(5, "Kod języka nie może przekraczać 5 znaków").optional(),
});

export const trainingSchema = z.object({
  title: titleSchema,
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").max(500, "Opis nie może przekraczać 500 znaków"),
  price: z.number().nonnegative("Cena musi być nieujemna"),
  duration: z.string().min(1, "Czas trwania jest wymagany").max(50, "Czas trwania nie może przekraczać 50 znaków"),
  level: z.string().min(1, "Poziom jest wymagany").max(50, "Poziom nie może przekraczać 50 znaków"),
  imageUrl: z.string().url("Nieprawidłowy format URL").optional().nullable(),
  featured: booleanSchema.optional().nullable(),
  order: orderSchema.optional(),
  language: z.string().min(2, "Kod języka musi mieć co najmniej 2 znaki").max(5, "Kod języka nie może przekraczać 5 znaków").optional(),
});

export const sectionSettingSchema = z.object({
  sectionKey: keySchema,
  displayName: z.string().min(2, "Nazwa wyświetlana musi mieć co najmniej 2 znaki").max(100, "Nazwa wyświetlana nie może przekraczać 100 znaków"),
  order: orderSchema.optional(),
  isEnabled: booleanSchema.optional(),
  showInMenu: booleanSchema.optional(),
  metadata: z.string().optional().nullable(),
});

export const heroSettingSchema = z.object({
  pageKey: keySchema,
  title: titleSchema,
  subtitle: z.string().min(5, "Podtytuł musi mieć co najmniej 5 znaków").max(200, "Podtytuł nie może przekraczać 200 znaków"),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").max(500, "Opis nie może przekraczać 500 znaków"),
  imageUrl: z.string().url("Nieprawidłowy format URL"),
  primaryButtonText: z.string().max(50, "Tekst przycisku nie może przekraczać 50 znaków").optional().nullable(),
  primaryButtonUrl: z.string().max(200, "URL nie może przekraczać 200 znaków").optional().nullable(),
  secondaryButtonText: z.string().max(50, "Tekst przycisku nie może przekraczać 50 znaków").optional().nullable(),
  secondaryButtonUrl: z.string().max(200, "URL nie może przekraczać 200 znaków").optional().nullable(),
  isEnabled: booleanSchema,
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Wiadomość jest wymagana").max(500, "Wiadomość nie może przekraczać 500 znaków"),
  language: z.string().min(2, "Kod języka musi mieć co najmniej 2 znaki").max(5, "Kod języka nie może przekraczać 5 znaków").optional(),
});

// Funkcje sanityzujące dane wejściowe
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'em', 'strong', 'del', 'a', 'img', 'table', 'thead',
      'tbody', 'tr', 'th', 'td', 'sup', 'sub'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'title', 'src', 'alt', 'class', 'id',
      'width', 'height', 'style', 'data-*'
    ],
    FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'embed', 'object', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    KEEP_CONTENT: true,
    USE_PROFILES: { html: true }
  });
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  
  for (const key in result) {
    if (typeof result[key] === 'string') {
      if (key === 'content' || key === 'description' || key === 'excerpt') {
        // Dla pól mogących zawierać dozwolony HTML
        result[key] = sanitizeHtml(result[key]);
      } else {
        // Dla zwykłych pól tekstowych bez HTML
        result[key] = DOMPurify.sanitize(result[key], { 
          ALLOWED_TAGS: [], // Brak tagów HTML
          ALLOWED_ATTR: []  // Brak atrybutów HTML
        });
      }
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      if (Array.isArray(result[key])) {
        result[key] = result[key].map((item: any) => {
          if (typeof item === 'string') {
            return DOMPurify.sanitize(item, { 
              ALLOWED_TAGS: [], 
              ALLOWED_ATTR: [] 
            });
          }
          return item;
        });
      } else {
        result[key] = sanitizeObject(result[key]);
      }
    }
  }
  
  return result;
}

// Funkcja kompletnej walidacji i sanityzacji wejścia
export async function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: any): Promise<T> {
  // Sanityzuj dane przed walidacją
  const sanitizedData = sanitizeObject(data);
  
  // Zweryfikuj dane przy użyciu schematu Zod
  const validatedData = await schema.parseAsync(sanitizedData);
  
  return validatedData;
}