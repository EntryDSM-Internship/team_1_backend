const router = require('express').Router();
const controller = require('./post.controller');
const authMiddleware = require('../../middlewares/auth');

router.post('/write', authMiddleware, controller.createOne);
router.delete('/delete/:_id', authMiddleware, controller.removeOne);
router.get('/like/:_id', authMiddleware, controller.likeOne);

module.exports = router;