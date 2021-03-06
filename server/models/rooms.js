const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    users: {
        type: [mongoose.Types.ObjectId],
        ref: 'User'
    },
});

module.exports = mongoose.model('Room', roomSchema);
