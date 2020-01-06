const router = require('express').Router();
const user = require('./user');
const post = require('./post');
const follow = require('./follow');
const main = require('./main');
const comment = require('./comment');
const profile = require('./profile');

router.use('/user', user);
router.use('/post', post);
router.use('/follow', follow);
router.use('/main', main);
router.use('/comment', comment);
router.use('/profile', profile)

module.exports = router;