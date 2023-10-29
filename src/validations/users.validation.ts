import { body, param } from 'express-validator';

export const userCreateValidationRules = () => {
  return [
    body('name', 'name is required').exists().isString().withMessage('name is input string').isLength({ min: 3 }),
    body('email', 'email is required').exists().isEmail().withMessage('email not valid').isLength({ min: 3 }),
    body('password', 'passoword is required').exists().isString().withMessage('password is input string').isLength({ min: 8 }).withMessage('password must be at least 8 chars long')
  ];
};

export const userUpateValidationRules = () => {
  return [
    param('id', 'id is required').exists().isString().withMessage('id is input string'),
    body('name', 'name is required').optional().isString().withMessage('name is input string').isLength({ min: 3 }),
    body('email', 'email is required').optional().isEmail().withMessage('email not valid').isLength({ min: 3 }),
    body('password', 'passoword is required').optional().isString().withMessage('password is input string').isLength({ min: 8 }).withMessage('password must be at least 8 chars long')
  ];
};

export const userDeleteValidationRules = () => {
  return [param('id', 'id is required').exists().isString().withMessage('id is input string')];
};
