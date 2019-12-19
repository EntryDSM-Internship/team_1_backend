const User = require('../../models/user');

//-------------------------------------------------------
// 팔로우 신청

const addFollowing = (req, res, next) => {
    const email = req.decoded.email;
    const nick = req.params.nick;

    const create = (user) => {
        User.findOneByNick(nick).allow.push(user.nick);
        res.status(200).json({ message: 'success' });
    }

    const onError = (error) => {
        res.status(409).json(error);
    }
    
    User.findOneByEmail(email)
    .then(create)
    .catch(onError)
}

//-------------------------------------------------------
// 팔로우 신청 목록

const allowList = (req, res, next) => {
    const email = req.decoded.email;

    const showList = (user) => {
        res.status(200).json({
            "list": user.allow,
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
        user.follower.push(nick)
        user.allow.splice(user.allow.indexOf(nick), 1);
        user.save();
        next();
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
    const email = req.decoded.email;
    const nick = req.params.nick;

    const add = (user) => {
        user.following.push(User.findOneByEmail(email).nick);
        user.save();
        res.status(200).json({ message: "success" });
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
        user.allow.splice(user.allow.indexOf(nick), 1);
        user.save();
        res.status(200).json({ message: "success" });
    }

    const onError = (error) => {
        res.status(500).json({ message: error });
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
    const email = req.decoded.email;
    const nick = req.params.nick;

    const removed = (user) => {
        user.follower.splice(user.follower.indexOf(User.findOneByEmail(email).nick), 1);
        user.save();
        res.status(200).json({ message: "success to unfollow" });        
    }

    const onError = (error) => {
        res.status(500).json({ message: error });
    }

    User.findOneByNick(nick)
    .then(removed)
    .catch(onError)
}

module.exports = {
    addFollowing,
    allowFollowing,
    addFollower,
    rejectFollowing,
    allowList,
    unFollow,
    unFollower
}