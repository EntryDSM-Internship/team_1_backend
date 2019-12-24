const User = require('../../models/user');
const Post = require('../../models/post');

const showPost = (req, res, next) => {
    const email = req.decoded.email;
    const show = (user) => {
        for (let i = 0; i < user.following.length; i++) {
            console.log(user.following[i].post);
        }
        res.status(200).json({
            message: "success",

        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error
        });
    }

    User.findOneByEmail(email)
    .then(show)
    .catch(onError)
}

module.exports = {
    showPost
}