const userRouter = require('express').Router();

const {
  validateId,
  validateUpdateProfile,
} = require('../middlewares/validator');

const {
  getUserId,
  updateProfile,
} = require('../controllers/users');

userRouter.get('/users/me', validateId, getUserId);
userRouter.patch('/users/me', validateUpdateProfile, updateProfile);

module.exports = userRouter;
