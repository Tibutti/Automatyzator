import { Request, Response, NextFunction } from "express";

// Prosty ogranicznik liczby żądań zapamiętujący IP i czas
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Mapa przechowująca informacje o limitach dla poszczególnych IP
const ipLimitMap = new Map<string, RateLimitEntry>();

// Konfiguracja limitów domyślnych
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minuta
const DEFAULT_MAX_REQUESTS = 300;    // 300 żądań na minutę (zwiększone dla developmentu)

// Konfiguracja limitów dla wrażliwych endpointów
const STRICT_WINDOW_MS = 15 * 60 * 1000; // 15 minut
const STRICT_MAX_REQUESTS = 30;          // 30 żądań na 15 minut (zwiększone dla developmentu)

// Regularnie czyść starą zawartość mapy
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipLimitMap.entries()) {
    if (now > data.resetTime) {
      ipLimitMap.delete(ip);
    }
  }
}, 60 * 1000); // Czyść co minutę

/**
 * Middleware ograniczające liczbę żądań od pojedynczego IP
 * @param maxRequests Maksymalna liczba żądań w oknie czasowym
 * @param windowMs Czas okna w milisekundach
 * @returns Express middleware
 */
export function rateLimiter(maxRequests: number = DEFAULT_MAX_REQUESTS, windowMs: number = DEFAULT_WINDOW_MS) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Pobierz IP klienta
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    
    const now = Date.now();
    
    // Pobierz lub utwórz wpis dla tego IP
    if (!ipLimitMap.has(ip)) {
      ipLimitMap.set(ip, {
        count: 0,
        resetTime: now + windowMs
      });
    }
    
    const limitData = ipLimitMap.get(ip)!;
    
    // Sprawdź czy musimy zresetować licznik
    if (now > limitData.resetTime) {
      limitData.count = 0;
      limitData.resetTime = now + windowMs;
    }
    
    // Zwiększ licznik i sprawdź limit
    limitData.count++;
    
    // Ustaw nagłówki informujące o limitach
    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - limitData.count).toString());
    res.setHeader("X-RateLimit-Reset", Math.ceil(limitData.resetTime / 1000).toString());
    
    // Jeśli przekroczono limit, zwróć błąd 429
    if (limitData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: "Przekroczono limit żądań. Spróbuj ponownie później.",
          retryAfter: Math.ceil((limitData.resetTime - now) / 1000)
        }
      });
    }
    
    next();
  };
}

/**
 * Middleware z surowszymi limitami dla wrażliwych endpointów (logowanie, resetowanie hasła)
 */
export function strictRateLimiter() {
  return rateLimiter(STRICT_MAX_REQUESTS, STRICT_WINDOW_MS);
}

/**
 * Funkcja do resetowania limitu dla określonego IP
 * Używana podczas developmentu do usuwania limitu gdy zostanie osiągnięty
 */
export function resetRateLimitForIp(ip: string): boolean {
  if (ipLimitMap.has(ip)) {
    ipLimitMap.delete(ip);
    return true;
  }
  return false;
}

/**
 * Funkcja do resetowania limitów dla wszystkich IPs
 * Używana podczas developmentu
 */
export function resetAllRateLimits(): number {
  const count = ipLimitMap.size;
  ipLimitMap.clear();
  return count;
}

/**
 * Middleware do identyfikacji wrażliwych endpointów i zastosowania odpowiednich limitów
 */
export function dynamicRateLimiter(req: Request, res: Response, next: NextFunction) {
  // Specjalny endpoint do czyszczenia limitów - tylko w środowisku development
  if (process.env.NODE_ENV === 'development' && req.path === '/api/dev/reset-rate-limits') {
    const ip = req.query.ip as string;
    let message = '';
    
    if (ip) {
      // Resetuj limit dla konkretnego IP
      const success = resetRateLimitForIp(ip);
      message = success 
        ? `Zresetowano limit dla IP: ${ip}` 
        : `Nie znaleziono IP: ${ip} w limitach`;
    } else {
      // Resetuj wszystkie limity
      const count = resetAllRateLimits();
      message = `Zresetowano limity dla ${count} adresów IP`;
    }
    
    return res.json({
      success: true,
      message
    });
  }

  // Lista wrażliwych endpointów
  const sensitiveEndpoints = [
    '/api/admin/login',
    '/api/admin/forgot-password',
    '/api/admin/reset-password',
    '/api/admin/change-password',
    '/api/auth'
  ];
  
  // Sprawdź czy endpoint jest wrażliwy
  const isSensitive = sensitiveEndpoints.some(endpoint => 
    req.path.startsWith(endpoint)
  );
  
  if (isSensitive) {
    return strictRateLimiter()(req, res, next);
  } else {
    return rateLimiter()(req, res, next);
  }
}