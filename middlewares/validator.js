const { celebrate, Joi, CelebrateError } = require('celebrate');

const { isURL } = require('validator');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError(`${value} не является URL адресом`);
  }
  return value;
};

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().regex(/[\wа-яё\s]/i).min(1),
    director: Joi.string().required().regex(/[\wа-яё\s]/i).min(1),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().regex(/[\wа-я.:!?"«»;@%№()*#,ё\s]/i).min(1),
    nameRU: Joi.string().required().regex(/[а-я.:!?"«»;@%№()*#,ё\s]/i).min(1),
    nameEN: Joi.string().required().regex(/[\w.:!?"«»;@%№()*#,\s]/i).min(1),
    image: Joi.string().required().custom(urlValidator),
    trailer: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.number().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().alphanum().length(24)
      .hex(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(30),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(30),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  validateId,
  validateUpdateProfile,
  validateCreateMovie,
  validateDeleteMovie,
  validateSignin,
  validateSignup,
};
