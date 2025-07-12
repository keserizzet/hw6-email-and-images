const createHttpError = require('http-errors');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(createHttpError(400, errorMessage));
    }
    
    next();
  };
};

module.exports = validateBody; 