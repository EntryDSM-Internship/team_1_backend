const router = require('express').Router();
const user = require('./user');
const post = require('./post');
const follow = require('./follow');
const main = require('./main');

router.use('/user', user);
router.use('/post', post);
router.use('/follow', follow);
router.use('/main', main);

module.exports = router;