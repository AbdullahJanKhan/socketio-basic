const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    data: {
        type: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    likedBy: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        default: []
    },
    room: {
        type: String,
    },
    isImage: {
        type: Boolean,
        default: false
    },
    image: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
