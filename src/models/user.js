const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

const User = new Schema({
    email: {
        type: String,
        required: true,
    },
    nick: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refresh: String,
    follower: Array,
    followerImg: Array,
    following: Array,
    followingImg: Array,
    allow: Array,
    allowImg: Array,
    img: {
        type: String,
        default: 'profile/0.jpg'
    },
    postId: Array
});

User.statics.create = function(name, nick, email, password) {
    const user = new this({
        name,
        nick,
        email,
        password,
    });

    return user.save();
}

User.statics.findOneByEmail = function(email) {
    return this.findOne({
        email
    }).exec();
}   

User.statics.findOneByNick = function(nick) {
    return this.findOne({
        nick
    }).exec();
}

User.statics.findByNick = function(nick) {
    return this.find({
        nick
    }).exec();
}

User.statics.findAll = function() {
    return this.findAll().exec();
}

User.methods.verify = function(password) {
    return this.password === password;
}

module.exports = mongoose.model('User', User);
