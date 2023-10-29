import { body, param } from 'express-validator';

export const postCreateValidationRules = () => {
  return [
    body('title', 'title is required').exists().isString().withMessage('title is input string').isLength({ min: 3 }),
    body('published', 'published is required').optional().isBoolean().withMessage('published is input boolean'),
    body('content', 'content is required').exists().isString().withMessage('content is input string').isLength({ min: 3 }),
    body('authorId', 'author id is required').exists().isNumeric().withMessage('author is input number')
  ];
};

export const postUpateValidationRules = () => {
  return [
    param('id', 'id is required').exists().isString().withMessage('id is input string'),
    body('title', 'title is required').optional().isString().withMessage('title is input string').isLength({ min: 3 }),
    body('published', 'published is required').optional().isBoolean().withMessage('published is input boolean'),
    body('content', 'content is required').optional().isString().withMessage('content is input string').isLength({ min: 3 }),
    body('authorId', 'author is required').optional().isNumeric().withMessage('author is input number')
  ];
};

export const postDeleteValidationRules = () => {
  return [param('id', 'id is required').exists().isString().withMessage('id is input string')];
};
