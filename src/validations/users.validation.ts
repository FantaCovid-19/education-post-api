import { validateFieldsParam, validateFieldsString, validateFieldsPassword, validateFieldsEmail } from '../helpers/validationFields.helper';

export const userCreateValidationRules = () => {
  return [validateFieldsString('name'), validateFieldsEmail('email'), validateFieldsPassword('password')];
};

export const userUpateValidationRules = () => {
  return [validateFieldsParam('id'), validateFieldsString('name', true), validateFieldsEmail('email', true), validateFieldsPassword('password', true)];
};

export const userDeleteValidationRules = () => {
  return [validateFieldsParam('id')];
};
