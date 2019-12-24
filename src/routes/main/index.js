const router = require('express').Router();
const controller = require('./main.controller');
const authMiddleware = require('../../middlewares/auth');

router.get('/', authMiddleware, controller.showPost);

module.exports = router;