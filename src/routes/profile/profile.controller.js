const User = require('../../models/user');
const Post = require('../../models/post');

const showMe = (req, res, next) => {
    const email = req.decoded.email;
    let postArr = [];

    const inArr = (user) => {
        Post.findAll(user.nick).then((post) => {
            for (let i = 0; i < post.length; i++) {
                postArr.push(post);
            }
        });
        return User.findOneByEmail(user.email);
    }

    const respond = (user) => {
        res.status(200).json({
            nick: user.nick,
            name: user.name,
            email: user.email,
            profile: user.img,
            following: user.following.length,
            follower: user.follower.length,
            isMe: true
        });
    }
    const onError = (err) => {
        res.status(500).json({
            message: err.message
        });
    }

    User.findOneByEmail(email)
    .then(inArr)
    .then(respond)
    .catch(onError)
}

const showProfile = (req, res, next) => {
    let isFollowed;
    let postArr = [];

    const inArr = (user) => {
        Post.findAll(user.nick).then((post) => {
            for (let i = 0; i < post.length; i++) {
                postArr.push(post);
            }
        });
        return User.findOneByEmail(user.email);
    }

    const isFollow = (user) => {
        if (user.following.indexOf(req.params.nick) === -1) isFollowed = false
        else isFollowed = true

        return User.findOneByNick(req.params.nick);
    }

    const respond = (user) => {
        res.status(200).json({
            nick: user.nick,
            name: user.name,
            email: user.email,
            profile: user.img,
            following: user.following.length,
            follower: user.follower.length,
            isFollowed: isFollowed,
            isMe: false
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    User.findOneByNick(req.params.nick)
    .then(inArr)
    .then(isFollow)
    .then(respond)
    .catch(onError)
}

const timeline = (req, res, next) => {
    let postArr = [];
    let arr = [];
    const nick = req.params.nick;
    const n = req.params.n;

    const inArr = (user) => {
        Post.findAll(user.nick).then((post) => {
            if (user.nick === req.decoded.nick) {
                for (let i = 0; i < post.length; i++) {
                    postArr.push({
                        _id: post[i]._id,
                        content: post[i].content,
                        img: post[i].img,
                        likeCount: post[i].likeCount,
                        like: post[i].like,
                        date: post[i].date,
                        nick: post[i].nick
                    })
                }
                for (let i = 0; i < post.length; i++) {
                    let commentArr = [];
                    for (let j = 0; j < post[i].comment.length; j++) {
                        commentArr.push({
                            comment: post[i].comment[j],
                            commenter: post[i].commenter[j],
                            commenterImg: post[i].commenterImg[j],
                        });
                    }
                    if (post[i].like.indexOf(user.nick) === -1) {
                        postArr[i].isMine = true;
                        postArr[i].isLike = false;
                        postArr[i].profile = user.img;
                        postArr[i].comment = commentArr;
                    } else {
                        postArr[i].isMine = true;
                        postArr[i].isLike = true;
                        postArr[i].profile = user.img;
                        postArr[i].comment = commentArr;
                    }
                }
            } else {
                for (let i = 0; i < post.length; i++) {
                    postArr.push({
                        _id: post[i]._id,
                        content: post[i].content,
                        img: post[i].img,
                        likeCount: post[i].likeCount,
                        like: post[i].like,
                        date: post[i].date,
                        nick: post[i].nick
                    })
                }
                for (let i = 0; i < post.length; i++) {
                    let commentArr = [];
                    for (let j = 0; j < post[i].comment.length; j++) {
                        commentArr.push({
                            comment: post[i].comment[j],
                            commenter: post[i].commenter[j],
                            commenterImg: post[i].commenterImg[j],
                        });
                    }
                    if (post[i].like.indexOf(user.nick) === -1) {
                        postArr[i].isMine = false;
                        postArr[i].isLike = false;
                        postArr[i].profile = user.img;
                        postArr[i].comment = commentArr;
                    } else {
                        postArr[i].isMine = false;
                        postArr[i].isLike = true;
                        postArr[i].profile = user.img;
                        postArr[i].comment = commentArr;
                    }
                }
            }
        });

        return User.findOneByNick(nick)
    }

    const sort = (user) => {
        if (postArr.length - (n * 10) < 10) {
            arr = postArr.slice(n * 10, postArr.length);
        } else if (postArr.length - (n * 10) === 0) {
            arr = null;
        } else {
            arr = postArr.slice(n * 10, (n * 10) + 10);
        }
    }

    const respond = () => {
        res.status(200).json({
            message: "success",
            post: arr
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    User.findOneByNick(nick)
    .then(inArr)
    .then(sort)
    .then(respond)
    .catch(onError)
}

const updateProfile = (req, res, next) => {
    const email = req.body.email;
    const nick = req.body.nick;
    const img = req.body.img;
    let changeNick;

    console.log(email, nick, img);

    const change = (user) => {
        if (email) {
            User.findOneByEmail(email).then((change) => {
                if (!change) {
                    user.email = email;
                    user.save();
                } else {
                    throw new Error('email already exists');
                }
            });
        }
        if (nick) {
            User.findOneByEmail(nick).then((change) => {
                if (!change) {
                    changeNick = user.nick;
                    user.nick = nick;
                    user.save();
                } else {
                    throw new Error('email already exists');
                }
            });
        }
        if (img) {
            user.img = img;
            user.save();
        }
        return User.findAll();
    }

    const changeFollowing = (user) => {
        for (let i = 0; i < user.following.lenth; i++) {
            if (user[i].following.indexOf(changeNick) !== -1) {
                user[i].following.splice(user[i].following.indexOf(changeNick), 1, nick);
            }
        }

        return User.findAll()
    }

    const changeFollower = (user) => {
        for (let i = 0; i < user.follower.lenth; i++) {
            if (user[i].follower.indexOf(changeNick) !== -1) {
                user[i].follower.splice(user[i].follower.indexOf(changeNick), 1, nick);
            }
        }

        return User.findAll()
    }

    const respond = () => {
        res.status(200).json({
            message: "success"
        });
    }

    const onError = (err) => {
        res.status(500).json({
            message: err.message
        });
    }

    User.findOneByEmail(req.decoded.email)
    .then(change)
    .then(changeFollowing)
    .then(changeFollower)
    .then(respond)
    .catch(onError)
}

module.exports = {
    showMe,
    showProfile,
    timeline,
    updateProfile
}