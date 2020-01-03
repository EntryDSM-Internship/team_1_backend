const User = require('../../models/user');
const Post = require('../../models/post');

const showMe = (req, res, next) => {
    const email = req.decoded.email;

    const respond = (user) => {
        res.status(200).json({
            nick: user.nick,
            name: user.name,
            email: user.email,
            profile: user.img,
            following: user.following.length,
            follower: user.follower.length
        });
    }
    const onError = (err) => {
        res.status(500).json({
            message: err.message
        });
    }

    User.findOneByEmail(email)
    .then(respond)
    .catch(onError)
}

const showPost = (req, res, next) => {
    const email = req.decoded.email;
    let postArr = [];
    let arr = [];
    num = 0;

    const inMineArr = (user) => {
        Post.findAll(user.nick).then((post) => {
            for (let i = 0; i < post.length; i++) {
                if (post[i].like.indexOf(user.nick) === -1) {
                    postArr.push({
                        post: post[i],
                        isMine: true,
                        isLike: false,
                        profile: user.img
                    });
                } else {
                    postArr.push({
                        post: post[i],
                        isMine: true,
                        isLike: true,
                        profile: user.img
                    });
                }
            }
        })
        return User.findOneByEmail(email);
    }
      
    const inFollowingArr = (user) => {
        for (let i = 0; i < user.following.length; i++) {
            Post.findAll(user.following[i]).then((post) => {
                for (let j = 0; j < post.length; j++) {
                    if (post[j].like.indexOf(user.nick) === -1) {
                        postArr.push({
                            post: post[j],
                            isMine: false,
                            isLike: false,
                            profile: user.followingImg[i],
                        });
                    } else {
                        postArr.push({
                            post: post[j],
                            isMine: false,
                            isLike: true,
                            profile: user.followingImg[i],
                        });
                    }
                }
            });
        }

        return User.findOneByEmail(user.email)
    }

    const sort = (user) => {
        postArr.sort(function (a, b) { 
            return a.post.date < b.post.date ? -1 : a.post.date > b.post.date ? 1 : 0;  
        });
        if (postArr.length - num < 10) {
            arr = postArr.slice(num, postArr.length);
        } else {
            arr = postArr.slice(num, num + 10);
            num += 10;
        }
    }

    const respond = () => {
        res.status(200).json({
            message: "success",
            post: arr,
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    User.findOneByEmail(email)
    .then(inMineArr)
    .then(inFollowingArr)
    .then(sort)
    .then(respond)
    .catch(onError)
}

module.exports = {
    showMe,
    showPost
}