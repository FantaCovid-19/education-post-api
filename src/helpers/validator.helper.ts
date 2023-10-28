import type { Request, Response, NextFunction } from 'express';
import type { Result, ValidationError } from 'express-validator';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = new Array();
  const validateFields = new Set<string>();

  errors.array().forEach((err: any) => {
    if (!validateFields.has(err.path)) {
      extractedErrors.push({ [err.path]: err.msg });
      validateFields.add(err.path);
    }
  });

  return res.status(400).json({ errors: extractedErrors });
};
