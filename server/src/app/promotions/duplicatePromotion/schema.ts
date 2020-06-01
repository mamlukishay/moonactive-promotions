import Joi from '@hapi/joi';

const schema = Joi.object({
  id: Joi.string().required(),
});

export { schema };
