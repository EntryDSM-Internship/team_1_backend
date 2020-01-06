const Post = require('../../models/post');

const writeComment = (req, res, next) => {
    const id = req.params._id;

    const writeOne = (post) => {
        post.comment.push(req.body.comment);
        post.commenter.push(req.decoded.nick);
        post.commenterImg.push(req.decoded.img);
        post.save();

        return Post.findOneById(id)
    }

    const respond = (post) => {
        res.status(200).json({
            message: "success",
            comment: req.body.comment,
            commenter: req.decoded.nick,
            commenterImg: req.decoded.img
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message,
        });
    }

    Post.findOneById(id)
    .then(writeOne)
    .then(respond)
    .catch(onError)
}

module.exports = {
    writeComment
}