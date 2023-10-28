import { body } from 'express-validator';

export const signUpValidationRules = () => {
  return [
    body('name', 'name is required').exists().isString().withMessage('name is input string').isLength({ min: 3 }),
    body('email', 'email is required').exists().isEmail().withMessage('email not valid').isLength({ min: 3 }),
    body('password', 'passoword is required').exists().isString().withMessage('password is input string').isLength({ min: 8 }).withMessage('password must be at least 8 chars long')
  ];
};

export const signInValidationRules = () => {
  return [
    body('email', 'email is required').exists().isEmail().withMessage('email not valid').isLength({ min: 3 }),
    body('password', 'passoword is required').exists().isString().withMessage('passoword is input String').isLength({ min: 8 }).withMessage('password must be at least 8 chars long')
  ];
};
