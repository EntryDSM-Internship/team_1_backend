const User = require('../../models/user');
const Post = require('../../models/post');

const showPost = (req, res, next) => {
    const email = req.decoded.email;
    let postArr = [];
    const n = req.params.n;
    const inMineArr = (user) => {
        Post.findAll(user.nick).then((post) => {
            for (let i = 0; i < post.length; i++) {
                postArr.push({
                    _id: post[i]._id,
                    content: post[i].content,
                    img: post[i].img,
                    likeCount: post[i].likeCount,
                    like: post[i].like,
                    date: post[i].date,
                    nick: post[i].nick,
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
        })
        return User.findOneByEmail(email);
    }
      
    const inFollowingArr = (user) => {
        for (let i = 0; i < user.following.length; i++) {
            Post.findAll(user.following[i]).then((post) => {
                for (let j = 0; j < post.length; j++) {
                    postArr.push({
                        _id: post[j]._id,
                        content: post[j].content,
                        img: post[j].img,
                        likeCount: post[j].likeCount,
                        like: post[j].like,
                        date: post[j].date,
                        nick: post[j].nick
                    })
                }
                for (let j = 0; j < post.length; j++) {
                    for (let k = 0; k < post[j].comment.length; k++) {
                        commentArr.push({
                            comment: post[j].comment[k],
                            commenter: post[j].commenter[k],
                            commenterImg: post[j].commenterImg[k],
                        });
                    }
                    if (post[j].like.indexOf(user.nick) === -1) {
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
            });
        }

        return User.findOneByEmail(user.email)
    }

    const sort = (user) => {
        postArr.sort(function (a, b) { 
            return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;  
        });
        console.log(postArr.length);
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
    showPost
}