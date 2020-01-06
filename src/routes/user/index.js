const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const controller = require('./user.controller');
const refreshMiddleware = require('../../middlewares/refresh');
const authMiddleware = require('../../middlewares/auth');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/profile/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
});

router.post('/register', controller.register);
router.post('/send', controller.emailSend);
router.post('/email', controller.emailAuth);
router.post('/exist', controller.existEmail, controller.existNick);
router.post('/profile/:nick', upload.single('img'), controller.profile);
router.post('/login', controller.login);
router.get('/refresh', refreshMiddleware, controller.refreshAccess);
router.get('/search/:nick', authMiddleware, controller.search);
router.patch('/password', controller.changePassword);

module.exports = router;