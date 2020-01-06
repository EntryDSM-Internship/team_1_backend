const Post = require('../../models/post');
const User = require('../../models/user');

//-------------------------------------------------------
// 글쓰기

const createOne = (req, res, next) => {
    const content = req.body.content;
    console.log(content);
    const nick = req.decoded.nick;
    const userimg = req.decoded.img;
    let profile;
    let id;

    const save = (post) => {
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                post.img.push('post/' + req.files[i].filename);
            }
            post.save();
        }
        id = post._id;
        return User.findOneByNick(nick)
    }

    const post = (user) => {
        profile = user.img;
        user.postId.push(id);
        user.save();
        return Post.findOneById(id)
    }

    const respond = (post) => {
        res.status(200).json({
            message: "success",
            post,
            profile
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    Post.create(nick, userimg, content)
    .then(save)
    .then(post)
    .then(respond)
    .catch(onError)
}

//-------------------------------------------------------
// 글 삭제

const removeOne = (req, res, next) => {
    const remove = (post) => {
        post.remove();
        post.save();
        return User.findOneByNick(req.decoded.nick)
    }

    const removePostId = (user) => {
        user.postId.splice(user.postId.indexOf(req.params._id), 1);
        user.save();
    }

    const respond = () => {
        res.status(200).json({
            message: 'success',
        });
    }

    const onError = (err) => {
        res.status(403).json(err.message);
    }

    Post.findOneById(req.params._id)
    .then(remove)
    .then(removePostId)
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
            post.likeCount = post.likeCount + 1;
            post.like.push(nick);
            post.save();
        } else {
            post.like.splice(check, 1);
            post.likeCount--;
            post.save();
        }
        res.status(200).json({
            message: 'success',
            like: post.likeCount,
        });
    }

    const onError = (error) => {
        console.log(error.message);
        res.status(500).json({ message: error });
    }

    Post.findOneById(req.params._id)
    .then(like)
    .catch(onError)
}

module.exports = {
    createOne,
    removeOne,
    likeOne
}