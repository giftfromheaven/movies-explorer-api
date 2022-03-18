const router = require('express').Router();

const {
  validateSignin,
  validateSignup,
} = require('../middlewares/validator');

const {
  login,
  createUser,
  logout,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFoundError = require('../errors/not-found-error');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);
router.get('/signout', logout);

router.use(auth, userRouter);
router.use(auth, movieRouter);

router.use('/*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
