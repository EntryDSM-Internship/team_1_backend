const router = require('express').Router();
const user = require('./user');
const post = require('./post');
const follow = require('./follow');

router.use('/user', user);
router.use('/post', post);
router.use('/follow', follow);

module.exports = router;