const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    data: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    room: {
        type: String,
    },
    time: {
        type: String,
    }
});

module.exports = mongoose.model('Message', messageSchema);
