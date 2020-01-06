const router = require('express').Router();
const controller = require('./post.controller');
const authMiddleware = require('../../middlewares/auth');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/post/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
});


router.post('/write', authMiddleware, upload.array('img', 4), controller.createOne);
router.delete('/delete/:_id', authMiddleware, controller.removeOne);
router.get('/like/:_id', authMiddleware, controller.likeOne);

module.exports = router;