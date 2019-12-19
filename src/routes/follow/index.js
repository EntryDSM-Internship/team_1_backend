const router = require('express').Router();
const controller = require('./follow.controller');
const authMiddleware = require('../../middlewares/auth');

router.post('/following', authMiddleware, controller.addFollowing);
router.get('/list', authMiddleware, controller.allowList);
router.get('/allow', authMiddleware, controller.allowFollowing, controller.addFollower);
router.get('/reject', authMiddleware, controller.rejectFollowing);
router.get('/unfollow', authMiddleware, controller.unFollow, controller.unFollower);

module.exports = router;