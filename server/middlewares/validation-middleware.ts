import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sanitizeObject } from "../validation";

// Błędy niestandardowe dla lepszej obsługi błędów walidacji
export class ValidationError extends Error {
  public status: number;
  public errors: any;

  constructor(message: string, errors: any = null) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
    this.errors = errors;
  }
}

// Middleware do walidacji body żądania według podanego schematu
export function validateBody(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanityzuj dane wejściowe
      const sanitizedData = sanitizeObject(req.body);
      req.body = sanitizedData;

      // Waliduj dane
      const validatedData = await schema.parseAsync(sanitizedData);
      
      // Zastąp dane w req.body zwalidowanymi i sanityzowanymi danymi
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(
          "Błąd walidacji danych wejściowych", 
          error.errors
        );
        return next(validationError);
      }
      next(error);
    }
  };
}

// Middleware do walidacji parametrów zapytania według podanego schematu
export function validateQuery(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanityzuj dane wejściowe
      const sanitizedData = sanitizeObject(req.query);
      
      // Waliduj dane
      const validatedData = await schema.parseAsync(sanitizedData);
      
      // Zastąp dane w req.query zwalidowanymi i sanityzowanymi danymi
      req.query = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(
          "Błąd walidacji parametrów zapytania", 
          error.errors
        );
        return next(validationError);
      }
      next(error);
    }
  };
}

// Middleware do walidacji parametrów URL według podanego schematu
export function validateParams(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanityzuj dane wejściowe
      const sanitizedData = sanitizeObject(req.params);
      
      // Waliduj dane
      const validatedData = await schema.parseAsync(sanitizedData);
      
      // Zastąp dane w req.params zwalidowanymi i sanityzowanymi danymi
      req.params = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(
          "Błąd walidacji parametrów URL", 
          error.errors
        );
        return next(validationError);
      }
      next(error);
    }
  };
}

// Middleware do obsługi błędów walidacji
export function validationErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors
    });
  }
  next(err);
}