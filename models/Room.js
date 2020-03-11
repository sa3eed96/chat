const mongoose = require('mongoose');
const stringValidation = require('../helpers/stringValidation');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!stringValidation(value))
                throw new Error('room name is invalid');
        }
    },
    userName: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});


const Room = mongoose.model('Room',roomSchema);

module.exports = Room;