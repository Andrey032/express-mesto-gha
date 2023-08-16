const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const {
  OK_CODE, CREATED_CODE,
} = require('../utils/constants');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(CREATED_CODE).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Карточка по указанному id не найдена'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => {
      res.status(OK_CODE).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный id: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный id: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.disLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный id: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
