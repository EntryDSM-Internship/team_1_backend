const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    nick: String,
    content: String,
    good: Boolean,
    goodCount: Number
});

Post.statics.create = function (nick, content) {
    const post = new this({
        nick,
        content,
    });

    return post.save();
}

Post.statics.findOneById = function(_id) {
    return this.findOne({
        _id
    }).exec();
}

module.exports = mongoose.model('Post', Post);