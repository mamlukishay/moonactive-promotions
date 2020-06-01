import Joi from '@hapi/joi';

const paramsSchema = Joi.object({
  id: Joi.string().required(),
});

export { paramsSchema };
