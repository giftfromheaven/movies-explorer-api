const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .orFail(new NotFoundError('Передан несуществующий id пользователя.'))
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.status(201).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании фильма');
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Передан несуществующий _id фильма.');
      }
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError('Нет доступа к удалению фильма.');
      } else {
        Movie.findByIdAndDelete(movieId)
          .then((deletedMovie) => {
            res.send({ data: deletedMovie });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
