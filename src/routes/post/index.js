const router = require('express').Router();
const controller = require('./post.controller');
const authMiddleware = require('../../middlewares/auth');

router.post('/write', authMiddleware, controller.createOne);
router.delete('/delete/:_id', authMiddleware, controller.removeOne);

module.exports = router;