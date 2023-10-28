import { body, query } from 'express-validator';

export const postCreateValidationRules = () => {
  return [
    body('title', 'title is required').exists().isString().withMessage('title is input string').isLength({ min: 3 }),
    body('published', 'published is required').optional().isBoolean().withMessage('published is input boolean'),
    body('content', 'content is required').exists().isString().withMessage('content is input string').isLength({ min: 3 }),
    body('authorId', 'author is required').exists().isNumeric().withMessage('author is input number').isLength({ min: 3 })
  ];
};

export const postUpateValidationRules = () => {
  return [
    query('id', 'id is required').exists().isString().withMessage('id is input string'),
    body('title', 'title is required').optional().isString().withMessage('title is input string').isLength({ min: 3 }),
    body('published', 'published is required').optional().isBoolean().withMessage('published is input boolean'),
    body('content', 'content is required').optional().isString().withMessage('content is input string').isLength({ min: 3 }),
    body('authorId', 'author is required').optional().isNumeric().withMessage('author is input number').isLength({ min: 3 })
  ];
};

export const postDeleteValidationRules = () => {
  return [query('id', 'id is required').exists().isString().withMessage('id is input string')];
};
