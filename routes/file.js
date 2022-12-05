const { findAll, findOne, upload, download, remove, update } = require('../handlers/FileHandler');

const auth = require('../middlewares/auth');

const router = require('express').Router();

router.get('/list', auth, findAll);
router.get('/:id', auth, findOne);
router.get('/download/:id', auth, download);

router.post('/upload', auth, upload);

router.put('/update/:id', auth, update);

router.delete('/delete/:id', auth, remove);

module.exports = router;
