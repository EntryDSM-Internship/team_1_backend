const router = require('express').Router();
const controller = require('./profile.controller');
const authMiddleware = require('../../middlewares/auth');

router.get('/:nick', authMiddleware, controller.showProfile);
router.get('/', authMiddleware, controller.showMe);
router.get('/timeline/:nick/:n', authMiddleware, controller.timeline);
router.patch('/update', authMiddleware, controller.updateProfile);

module.exports = router;