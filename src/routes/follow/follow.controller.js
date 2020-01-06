const User = require('../../models/user');

//-------------------------------------------------------
// 팔로우 신청

const addFollowing = (req, res, next) => {
    const nick = req.params.nick;
    const create = (user) => {
        console.log(req.decoded.img)
        if (req.decoded.nick === nick) {
            throw new Error ('cant follow');
        } else {
            if (user.allow.indexOf(req.decoded.nick) === -1 && user.follower.indexOf(req.decoded.nick) === -1) {
                user.allow.push(req.decoded.nick);
                user.allowImg.push(req.decoded.img);
                console.log(req.decoded.img);
                user.save();
            } else {
                throw new Error('already followed');
            } 
        }
    }
    
    const respond = () => {
        res.status(200).json({
            message: "success"
        });
    }

    const onError = (error) => {
        res.status(400).json({
            message: error.message
        });
    }
    
    User.findOneByNick(nick)
    .then(create)
    .then(respond)
    .catch(onError)
}

//-------------------------------------------------------
// 팔로우 신청 목록

const allowList = (req, res, next) => {
    const email = req.decoded.email;
    const allowArr = [];
    const showList = (user) => {
        for(let i = 0; i < user.allow.length; i++) {
            allowArr.push({
                nick: user.allow[i],
                profile: user.allowImg[i],
            });
        }
        res.status(200).json({
            allow: allowArr
        });
    }

    const onError = (error) => {
        res.status(500).json(error);    
    }

    User.findOneByEmail(email)
    .then(showList)
    .catch(onError)
}

//-------------------------------------------------------
// 팔로우 수락

const allowFollowing = (req, res, next) => {
    const email = req.decoded.email;
    const nick = req.params.nick;
    
    const allowing = (user) => {
        if (user.allow.indexOf(nick) === -1) res.status(404).json({ message: "failed" });
        else {
            User.findOneByNick(nick).then((findUser) => {
                user.follower.push(nick)
                user.followerImg.push(findUser.img);
                user.allow.splice(user.allow.indexOf(nick), 1);
                user.allowImg.splice(user.allow.indexOf(nick), 1);
                user.save();
                next();
            })
        }
    }

    const onError = (error) => {
        res.status(500).json(error);
    }

    User.findOneByEmail(email)
    .then(allowing)
    .catch(onError)
}

//-------------------------------------------------------
// 수락 후 추가

const addFollower = (req, res, next) => {
    const nick = req.params.nick;


    const add = (user) => {
        if (user.following.indexOf(nick) === -1) {
            User.findOneByNick(req.decoded.nick).then((findUser) => {
                user.following.push(findUser.nick);
                user.followingImg.push(findUser.img);
                user.save();
                res.status(200).json({ message: "success" });
            }) 
        } else {
            res.status(409).json({ message: "already followed"});
        }
    }

    const onError = (error) => {
        res.status(500).json(error);
    }

    User.findOneByNick(nick)
    .then(add)
    .catch(onError)
}

//-------------------------------------------------------
// 팔로우 거절

const rejectFollowing = (req, res, next) => {
    const email = req.decoded.email;
    const nick = req.params.nick;

    const reject = (user) => {
        if (user.allow.indexOf(nick) === -1) {
            res.status(404).json({ message: "user not found" });
        } else {
            user.allow.splice(user.allow.indexOf(nick), 1);
            user.allowImg.splice(user.allow.indexOf(nick), 1);
            user.save();
            res.status(200).json({ message: "success" });
        }
    }

    const onError = (error) => {
        res.status(500).json({ message: error.message });
    }

    User.findOneByEmail(email)
    .then(reject)
    .catch(onError)
}

//-------------------------------------------------------
// 팔로우 취소

const unFollow = (req, res, next) => {
    const email = req.decoded.email;
    const nick = req.params.nick;

    const cancle = (user) => {
        user.following.splice(user.following.indexOf(nick), 1);
        user.followingImg.splice(user.following.indexOf(nick), 1);
        user.save();
        next();
    }

    const onError = (error) => {
        res.status(500).json({ message: error });
    }

    User.findOneByEmail(email)
    .then(cancle)
    .catch(onError)
}

const unFollower = (req, res, next) => {
    const nick = req.params.nick;

    const removed = (user) => {
        user.follower.splice(user.follower.indexOf(req.decoded.nick), 1);
        user.followerImg.splice(user.follower.indexOf(req.decoded.nick), 1);
        user.save();
        res.status(200).json({ message: "success to unfollow" });        
    }

    const onError = (error) => {
        res.status(500).json({ message: error });
    }

    User.findOneByNick(nick)
    .then(userFind)
    .then(removed)
    .catch(onError)
}

//-------------------------------------------------------
// 팔로우 목록

const followList = (req, res, next) => {
    const email = req.decoded.email;
    const followingArr = [];
    const followerArr = [];
    const showFollow = (user) => {
        for (let i = 0; i < user.following.length; i++) {
            followingArr.push({
                nick: user.following[i],
                profile: user.followingImg[i]
            });
        }

        for (let i = 0; i < user.follower.length; i++) {
            followerArr.push({
                nick: user.follower[i],
                profile: user.followerImg[i]
            });
        }
        res.status(200).json({
            message: "success",
            following: followingArr,
            follower: followerArr
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    User.findOneByEmail(email)
    .then(showFollow)
    .catch(onError)
}

module.exports = {
    addFollowing,
    allowFollowing,
    addFollower,
    rejectFollowing,
    allowList,
    unFollow,
    unFollower,
    followList
}