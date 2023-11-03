import { validateFieldsParam, validateFieldsString, validateFieldsNumber, validateFieldsBoolean } from '../helpers/validationFields.helper';

export const postCreateValidationRules = () => {
  return [validateFieldsString('title'), validateFieldsBoolean('published', true), validateFieldsString('content'), validateFieldsNumber('authorId')];
};

export const postUpateValidationRules = () => {
  return [validateFieldsParam('id'), validateFieldsString('title', true), validateFieldsBoolean('published', true), validateFieldsString('content', true), validateFieldsNumber('authorId', true)];
};

export const postDeleteValidationRules = () => {
  return [validateFieldsParam('id')];
};
