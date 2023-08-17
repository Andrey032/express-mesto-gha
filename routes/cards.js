const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, disLikeCard,
} = require('../controllers/cards');
const { validateCardId, validateCreateCard } = require('../middlewares/validateCelebrate');

router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, disLikeCard);

module.exports = router;
