const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    nick: String,
    userImg: String,
    content: {
        type: String,
        default: null
    },
    img: Array,
    likeCount: {
        type: Number,
        default: 0
    },
    like: Array,
    date: {
        type: Date,
        default: Date.now,
    },
    comment: Array,
    commenter: Array,
    commenterImg: Array,
});

Post.statics.create = function (nick, userImg, content) {
    const post = new this({
        nick,
        userImg,
        content,
    });

    return post.save();
}

Post.statics.findByNick = function(nick) {
    return this.find({
        nick
    }).exec();
}

Post.statics.findOneById = function(_id) {
    return this.findOne({
        _id
    }).exec();
}

Post.statics.findAll = function(nick) {
    return this.find({
        nick
    }).exec();
}

module.exports = mongoose.model('Post', Post);