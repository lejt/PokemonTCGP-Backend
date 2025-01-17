import * as Joi from '@hapi/joi';

export const configurationValidationSchema = Joi.object({
  DEPLOY_ENV_HOST: Joi.string().required().default('localhost'),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_LOCAL_PORT: Joi.number().required().default(5632),
  BACKEND_PORT: Joi.number().required().default(3000),
});
