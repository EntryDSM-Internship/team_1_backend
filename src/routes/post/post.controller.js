const Post = require('../../models/post');

//-------------------------------------------------------
// 글쓰기

const createOne = (req, res, next) => {
    const { title, content } = req.body;
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

    Post.create(nick, title, content)
    .then(respond)
    .catch(onError)
}

//-------------------------------------------------------
// 글 삭제

const removeOne = (req, res, next) => {
    const del = (post) => {
        if (req.decoded.nick === post.nick) post.remove();
        else throw new Error('권한이 없습니다');
    }
    
    const respond = (post) => {
        res.status(200).json({
            message: 'success',
            post,
        });
    }

    const onError = (err) => {
        res.status(409).json(err.message);
    }

    Post.findOneById(req.params._id)
    .then(del)
    .then(respond)
    .catch(onError)
}



module.exports = {
    createOne,
    removeOne
}