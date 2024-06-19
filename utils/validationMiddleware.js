const ExpressError = require("./ExpressError");

const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      return next(new ExpressError(400, message));
    } else {
      next();
    }
  };
};

module.exports = validateMiddleware;
