const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Anonymous'
    },
    likes: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        default: [],
    },
})

module.exports = mongoose.model('User', userSchema);