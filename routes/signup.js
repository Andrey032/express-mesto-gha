const router = require('express').Router();
const { createUser } = require('../controllers/users');
const { validateSignup } = require('../middlewares/validateCelebrate');

router.post('/', validateSignup, createUser);

module.exports = router;
