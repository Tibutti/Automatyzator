import { Request, Response, NextFunction } from "express";
import { ValidationError } from "./validation-middleware";

// Standardowy interfejs dla błędów
interface ErrorResponse {
  message: string;
  status: number;
  errors?: any;
  stack?: string;
}

// Globalny middleware do obsługi błędów
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[Error] ${err.message}`, err);

  const error: ErrorResponse = {
    message: err.message || "Wystąpił nieoczekiwany błąd",
    status: err.status || 500,
  };

  // Dodaj szczegóły dla błędów walidacji
  if (err instanceof ValidationError) {
    error.errors = err.errors;
  }

  // Dodaj stack trace w środowisku deweloperskim
  if (process.env.NODE_ENV === "development") {
    error.stack = err.stack;
  }

  return res.status(error.status).json({
    success: false,
    error: {
      message: error.message,
      ...(error.errors && { errors: error.errors }),
      ...(error.stack && { stack: error.stack }),
    },
  });
}

// Middleware do obsługi błędów 404 dla niezdefiniowanych ścieżek
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Nie znaleziono zasobu: ${req.originalUrl}`);
  (error as any).status = 404;
  next(error);
}

// Middleware do ograniczania rozmiarów danych wejściowych
export function payloadSizeHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        message: "Przekroczono maksymalny rozmiar danych wejściowych",
      },
    });
  }
  next(err);
}