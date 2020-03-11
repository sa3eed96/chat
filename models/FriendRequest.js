const mongoose = require('mongoose');

const firendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
});


const FriendRequest = mongoose.model('FriendRequest', firendRequestSchema);

module.exports = FriendRequest;