const {signin, newToken, signup, info, logout} = require('../handlers/UserHandler');

const auth = require('../middlewares/auth');

const router = require('express').Router();

router.get('/info', auth, info);
router.get('/logout', auth, logout);

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signin/new_token', newToken);

module.exports = router;
