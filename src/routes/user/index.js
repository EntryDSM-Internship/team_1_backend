const router = require('express').Router();
const controller = require('./user.controller');
const refreshMiddleware = require('../../middlewares/refresh');
const authMiddleware = require('../../middlewares/auth');

router.post('/register', controller.register);
router.post('/send', controller.emailSend);
router.post('/email', controller.emailAuth);
router.post('/exist', controller.existEmail, controller.existNick);
router.post('/login', controller.login);

module.exports = router;