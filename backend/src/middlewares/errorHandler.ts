/* eslint-disable @typescript-eslint/no-explicit-any */
// src/middlewares/errorHandler.ts
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { CustomError } from '../utils/errors';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface ValidationErrorDetail {
  message: string;
  path: (string | number)[];
  type: string;
}

export const errorHandler = (
  err: Error & {
    statusCode?: number;
    code?: number;
    details?: ValidationErrorDetail[];
    errors?: Record<string, { message: string }>;
  },
  req: Request,
  res: Response
) => {
  console.error('Error:', err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode || 500).json({
      message: err.message,
      errors: err.errors,
    });
  }

  if ('details' in err && Array.isArray(err.details)) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.details.map((detail: any) => ({
        message: detail.message,
        path: detail.path,
      })),
    });
  }

  if (err instanceof MongooseError.ValidationError) {
    const errors = err.errors
      ? Object.values(err.errors).map(e => ({
          message: e.message,
          path: e.path,
        }))
      : [];

    return res.status(400).json({
      message: 'Validation Error',
      errors,
    });
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Something went wrong',
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.path}`,
  });
};
