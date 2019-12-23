const router = require('express').Router();
const controller = require('./main.controller');
const authMiddleware = require('../../middlewares/auth');

module.exports = router;