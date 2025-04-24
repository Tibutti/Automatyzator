import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(price / 100);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

// Calculate read time in minutes
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Generate stars for ratings
export function generateStarRating(rating: number, maxRating = 50) {
  const fullStars = Math.floor(rating / 10);
  const halfStar = rating % 10 >= 5 ? 1 : 0;
  const emptyStars = Math.floor((maxRating - rating) / 10);
  
  return {
    full: fullStars,
    half: halfStar,
    empty: emptyStars
  };
}
