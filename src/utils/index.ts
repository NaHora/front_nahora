import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};
  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}

export const removeMask = (value: string) => {
  if (value) return value.replace(/[^0-9,]/g, '').replace(',', '.');
};
