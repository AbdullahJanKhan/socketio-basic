const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    data: {
        type: String
    },
    userId: {
        type: String,
    },
    likedBy: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        default: []
    },
    room: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
