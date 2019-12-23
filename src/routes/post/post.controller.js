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

//-------------------------------------------------------
// 글 좋아요

const likeOne = (req, res, next) => {
    const nick = req.decoded.nick;
    const like = (post) => {
        const check = post.like.indexOf(nick);
        if (check == -1) {
            post.likeCount++;
            post.like.push(nick);
            post.save();
        } else {
            post.like.splice(check, 1);
            post.likeCount--;
            post.save();
        }
    }

    const respond = (post) => {
        res.status(200).json({
            message: 'success',
            like: post.likeCount,
        });
    }

    const onError = (error) => {
        res.status(500).json({ message: error });
    }

    Post.findOneById(req.params._id)
    .then(like)
    .then(respond)
    .catch(onError)
}


module.exports = {
    createOne,
    removeOne,
    likeOne
}