const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Anonymous'
    },
    likedMsgs: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        default: []
    },
})

module.exports = mongoose.model('User', userSchema);