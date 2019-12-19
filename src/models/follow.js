const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Follow = new Schema({
    email: String,
    follower: Array,
    following: Array,
    allow: Boolean
});

Follow.statics.add = function(email) {
    const follow = new this({
        email,
    });
}

module.exports = mongoose.model('Follow', Follow)
