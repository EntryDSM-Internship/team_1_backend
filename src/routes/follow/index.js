const router = require('express').Router();
const controller = require('./follow.controller');
const authMiddleware = require('../../middlewares/auth');

router.get('/following/:nick', authMiddleware, controller.addFollowing);
router.get('/allowlist', authMiddleware, controller.allowList);
router.get('/allow/:nick', authMiddleware, controller.allowFollowing, controller.addFollower);
router.get('/reject/:nick', authMiddleware, controller.rejectFollowing);
router.delete('/unfollow/:nick', authMiddleware, controller.unFollow, controller.unFollower);
router.get('/followlist', authMiddleware, controller.followList);

module.exports = router;