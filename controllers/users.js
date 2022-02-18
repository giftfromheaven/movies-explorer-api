const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const jwtData = require("../utils/const");

const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");
const NotAuthError = require("../errors/not-auth-error");

const getUserId = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .orFail(new NotFoundError("Пользователь по указанному id не найден"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err) {
        next(
          new BadRequestError(
            "Переданы некорректные данные для поиска пользователя"
          )
        );
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      })
    )
    .then((user) => {
      res.send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя."
          )
        );
      } else if (err.code === 11000) {
        next(new ConflictError("Пользователь с таким email уже существует."));
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const id = req.user._id;
  const newName = req.body.name;
  const newEmail = req.body.email;

  User.findOneAndUpdate(
    { _id: id },
    { name: newName, email: newEmail },
    { runValidators: true, new: true }
  )
    .orFail(new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении профиля пользователя"
          )
        );
      } else if (err.code === 11000) {
        next(new ConflictError("Пользователь с таким email уже существует"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .orFail(new Error("IncorrectEmail"))
    .then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new NotAuthError("Указан некорректный Email или пароль"));
        } else {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === "production" ? JWT_SECRET : jwtData,
            { expiresIn: "7d" }
          );

          res
            .cookie("jwt", token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: "None",
              secure: true,
            })
            .send({ message: "Вы успешно авторизовались" });
        }
      });
    })
    .catch((err) => {
      if (err.message === "IncorrectEmail") {
        next(new NotAuthError("Указан некорректный Email или пароль"));
      } else {
        next(err);
      }
    });
};

const logout = (req, res) => {
  res
    .status(200)
    .clearCookie("jwt", {
      sameSite: "None",
      secure: true,
    })
    .send({ message: "Выход" });
};

module.exports = {
  getUserId,
  createUser,
  updateProfile,
  login,
  logout,
};
