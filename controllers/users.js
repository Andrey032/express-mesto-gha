const mongoose = require('mongoose');
const User = require('../models/user');
const {
  NOT_FOUND_CODE, BAD_REQUEST_CODE, SERVER_ERROR_CODE, OK_CODE, CREATED_CODE,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: `Некорректный id: ${req.params.userId}` });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь по указанному id: ${req.params.userId} не найден.` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(OK_CODE).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному id не найден.' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: `Некорректный id: ${req.params.userId}` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному id не найден.' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: `Некорректный id: ${req.params.userId}` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
