import * as Joi from '@hapi/joi';

export const configurationValidationSchema = Joi.object({
  DB_HOST: Joi.string().required().default('localhost'),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required().default(5632),
  PORT: Joi.number().required().default(3001),
});
