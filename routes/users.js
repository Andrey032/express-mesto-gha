const router = require('express').Router();
const {
  getMe, getUsers, getUserById, editUserData, editUserAvatar,
} = require('../controllers/users');
const { validateUserId, validateEditAvatar, validateEditUser } = require('../middlewares/validateCelebrate');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateEditUser, editUserData);
router.patch('/me/avatar', validateEditAvatar, editUserAvatar);

module.exports = router;
