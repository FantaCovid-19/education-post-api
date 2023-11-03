import { body, query, param } from 'express-validator';

const validateFieldsString = (field: string, optional: boolean = false) => {
  const validateFields = body(field, `${field} is required`)
    .exists()
    .isString()
    .withMessage(`${field} must be a string`)
    .isLength({ min: 3 })
    .withMessage(`${field} must be at least 3 character long`);

  return optional ? validateFields.optional() : validateFields;
};

const validateFieldsNumber = (field: string, optional: boolean = false) => {
  const validateFields = body(field, `${field} is required`).exists().isNumeric().withMessage(`${field} must be a number`);

  return optional ? validateFields.optional() : validateFields;
};

const validateFieldsBoolean = (field: string, optional: boolean = false) => {
  const validateFields = body(field, `${field} is required`).exists().isBoolean().withMessage(`${field} must be a boolean`);

  return optional ? validateFields.optional() : validateFields;
};

const validateFieldsArray = (field: string, optional: boolean = false) => {
  const validateFields = body(field, `${field} is required`).exists().isArray().withMessage(`${field} must be an array`);

  return optional ? validateFields.optional() : validateFields;
};

const validateFieldsPassword = (field: string, optional: boolean = false) => {
  const validateFields = body(field, `${field} is required`)
    .exists()
    .isString()
    .withMessage(`${field} must be a string`)
    .isLength({ min: 8 })
    .withMessage(`${field} must be at least 8 character long`);

  return optional ? validateFields.optional() : validateFields;
};

const validateFieldsEmail = (field: string, optional: boolean = false) => {
  const validateFields = body(field, `${field} is required`)
    .exists()
    .isEmail()
    .withMessage(`${field} must be a valid email`)
    .isLength({ min: 3 })
    .withMessage(`${field} must be at least 3 character long`);

  return optional ? validateFields.optional() : validateFields;
};

const validateFieldsQuery = (field: string, optional: boolean = false) => {
  const validateFields = query(field, `${field} is required`).exists().isString().withMessage(`${field} must be a string`);

  return optional ? validateFields.optional() : validateFields;
};

const validateFieldsParam = (field: string, optional: boolean = false) => {
  const validateFields = param(field, `${field} is required`).exists().isString().withMessage(`${field} must be a string`);

  return optional ? validateFields.optional() : validateFields;
};

export { validateFieldsString, validateFieldsNumber, validateFieldsBoolean, validateFieldsArray, validateFieldsPassword, validateFieldsEmail, validateFieldsQuery, validateFieldsParam };
