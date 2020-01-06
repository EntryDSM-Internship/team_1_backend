const router = require('express').Router();
const controller = require('./comment.controller');
const authMiddleware = require('../../middlewares/auth');

router.post('/:_id', authMiddleware, controller.writeComment);

module.exports = router;