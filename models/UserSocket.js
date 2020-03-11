const mongoose = require('mongoose');
const stringValidation = require('../helpers/stringValidation');

const UserSocketSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique:true,
        validate(value){
            if(!stringValidation(value))
                throw new Error('userName is invalid');
        }
    },
});


const UserSocket = mongoose.model('UserSocket',UserSocketSchema);

module.exports = UserSocket;