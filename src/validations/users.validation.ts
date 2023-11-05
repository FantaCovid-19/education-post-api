import { validateFieldsParam, validateFieldsString, validateFieldsPassword, validateFieldsEmail, validateFieldsQuery } from '../helpers/validationFields.helper';

export const userGetAllValidationRules = () => {
  return [validateFieldsQuery('page', true), validateFieldsQuery('limit', true)];
};

export const userGetByIdValidationRules = () => {
  return [validateFieldsParam('id')];
};

export const userCreateValidationRules = () => {
  return [validateFieldsString('name'), validateFieldsEmail('email'), validateFieldsPassword('password')];
};

export const userUpateValidationRules = () => {
  return [validateFieldsParam('id'), validateFieldsString('name', true), validateFieldsEmail('email', true), validateFieldsPassword('password', true)];
};

export const userDeleteValidationRules = () => {
  return [validateFieldsParam('id')];
};
