import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '@exceptions/http/HttpException';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { removeRequestUnwantedProperties } from '@utils/utils';
import { HttpError } from '@exceptions/http/HttpError';

const formatErrors = (errors: ValidationError[], property = '', formatted = {}) => {
  errors.forEach((error: ValidationError) => {
    if ('constraints' in error) formatted[!property ? error.property : `${property}[${error.property}]`] = Object.values(error.constraints).join(',');
    else return { ...formatted, ...formatErrors(error.children, property ? `${property}[${error.property}]` : `${error.property}`, formatted) };
  });
  return formatted;
};

const validationMiddleware = (
  RequestDTO: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  removeUnwantedProperties = true,
  skipMissingProperties = false,
): RequestHandler => {
  return (req, res, next) => {
    try {
      // remove unwanted values from object
      if (removeUnwantedProperties) {
        const className = new RequestDTO()?.constructor?.name;
        const schema = validationMetadatasToSchemas({ schemaNameField: className });
        const DTOProperties = schema[className]?.properties;
        const DTOKeys = Object.keys(DTOProperties);
        req[value] = removeRequestUnwantedProperties(DTOKeys, req[value]);
      }

      // use class-validator to validate properties types
      validate(plainToInstance(RequestDTO, req[value]), {
        skipMissingProperties,
      }).then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = 'Validation error: ' + errors.map((error: ValidationError) => `${error?.property}`).join(', ');
          const formattedErrors = formatErrors(errors);
          next(new HttpError({ message, errors: { errors: formattedErrors, status: 400 } }));
        } else {
          next();
        }
      });
    } catch (e) {
      console.log('[VALIDATION] Error:', e);
      next(new HttpException(500, e.message));
    }
  };
};

export default validationMiddleware;
