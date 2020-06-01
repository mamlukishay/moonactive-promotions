import Joi from '@hapi/joi';
import { config } from '../../../config';

const schema = Joi.object({
  fromStartDateTS: Joi.number().default(null),
  count: Joi.number().positive().default(config.defaults.promotionsLimit),
});

export { schema };
