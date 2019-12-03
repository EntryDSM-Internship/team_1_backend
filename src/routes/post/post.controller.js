const Post = require('../../models/post');

const createOne = (req, res, next) => {
    const content = req.body.content;
    const nick = req.decoded.nick;

    const respond = (post) => {
        res.status(200).json({
            message: 'success',
            post,
        });
    }

    const onError = (err) => {
        res.status(500).json(err);
    }

    Post.create(nick, content)
    .then(respond)
    .catch(onError)
}

const removeOne = (req, res, next) => {
    const del = (post) => {
        post.remove()
    }
    
    const respond = (post) => {
        res.status(200).json({
            message: 'success',
            post,
        });
    }

    const onError = (err) => {
        res.status(500).json(err);
    }

    Post.findOneById(req.params._id)
    .then(remove)
    .then(respond)
    .catch(onError)
}

module.exports = {
    createOne,
    removeOne
}