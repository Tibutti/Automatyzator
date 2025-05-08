import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

// Maksymalna liczba prób logowania przed tymczasowym zablokowaniem konta
const MAX_LOGIN_ATTEMPTS = 5;

// Czas blokady konta w milisekundach (15 minut)
const ACCOUNT_LOCKOUT_TIME = 15 * 60 * 1000;

// Czas sesji w milisekundach (30 minut)
export const SESSION_MAX_AGE = 30 * 60 * 1000;

// Generuje losowy token o podanej długości
export function generateSecureToken(length = 32): string {
  return randomBytes(length).toString("hex");
}

// Generuje bezpieczny hash hasła z solą
export async function hashPassword(password: string): Promise<string> {
  // Generuj 32-bajtową losową sól
  const salt = randomBytes(32).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Porównuje podane hasło z przechowywanym hashem
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Sprawdza czy konto jest zablokowane
export function isAccountLocked(user: User): boolean {
  if (!user.lockedUntil) return false;
  return new Date(user.lockedUntil) > new Date();
}

// Sprawdza czy należy zablokować konto po nieudanym logowaniu
export function shouldLockAccount(loginAttempts: number): boolean {
  return loginAttempts >= MAX_LOGIN_ATTEMPTS;
}

// Oblicza czas do odblokowania konta w minutach
export function timeUntilUnlock(lockedUntil: Date): number {
  const now = new Date();
  const diffMs = lockedUntil.getTime() - now.getTime();
  return Math.ceil(diffMs / 60000); // Konwersja milisekund na minuty
}

// Oblicza czas, do którego konto powinno być zablokowane
export function calculateLockoutTime(): Date {
  const lockoutTime = new Date();
  lockoutTime.setTime(lockoutTime.getTime() + ACCOUNT_LOCKOUT_TIME);
  return lockoutTime;
}

// Weryfikuje czy długość i złożoność hasła są wystarczające
export function isPasswordStrong(password: string): boolean {
  if (password.length < 8) return false;
  
  // Sprawdź czy hasło zawiera co najmniej jedną cyfrę
  if (!/\d/.test(password)) return false;
  
  // Sprawdź czy hasło zawiera co najmniej jedną dużą literę
  if (!/[A-Z]/.test(password)) return false;
  
  // Sprawdź czy hasło zawiera co najmniej jedną małą literę
  if (!/[a-z]/.test(password)) return false;
  
  // Sprawdź czy hasło zawiera co najmniej jeden znak specjalny
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  
  return true;
}