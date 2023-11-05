import { validateFieldsParam, validateFieldsQuery, validateFieldsString, validateFieldsNumber, validateFieldsBoolean } from '../helpers/validationFields.helper';

export const postGetAllValidationRules = () => {
  return [validateFieldsQuery('page', true), validateFieldsQuery('limit', true)];
};

export const postGetByIdValidationRules = () => {
  return [validateFieldsParam('id')];
};

export const postCreateValidationRules = () => {
  return [validateFieldsString('title'), validateFieldsBoolean('published', true), validateFieldsString('content'), validateFieldsNumber('authorId')];
};

export const postUpateValidationRules = () => {
  return [validateFieldsParam('id'), validateFieldsString('title', true), validateFieldsBoolean('published', true), validateFieldsString('content', true), validateFieldsNumber('authorId', true)];
};

export const postDeleteValidationRules = () => {
  return [validateFieldsParam('id')];
};
