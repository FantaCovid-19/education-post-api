import { validateFieldsString, validateFieldsEmail, validateFieldsPassword } from '../helpers/validationFields.helper';

export const signUpValidationRules = () => {
  return [validateFieldsString('name'), validateFieldsEmail('email'), validateFieldsPassword('password')];
};

export const signInValidationRules = () => {
  return [validateFieldsEmail('email'), validateFieldsPassword('password')];
};
