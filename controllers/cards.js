const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  NOT_FOUND_CODE, BAD_REQUEST_CODE, SERVER_ERROR_CODE, OK_CODE, CREATED_CODE,
} = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(CREATED_CODE).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            res.status(NOT_FOUND_CODE).send({ message: 'Карточка по указанному id не найдена' });
          } else {
            res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => {
      res.status(OK_CODE).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: `Карточка с id: ${req.params.cardId} не найдена.` });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: `Некорректный id: ${req.params.cardId}` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: `Карточка с id: ${req.params.cardId} не найдена.` });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: `Некорректный id: ${req.params.cardId}` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.disLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND_CODE).send({ message: `Карточка с id: ${req.params.cardId} не найдена.` });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_CODE).send({ message: `Некорректный id: ${req.params.cardId}` });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
