const mongoose = require('mongoose');
const validator = require('validator');
const stringValidation = require('../helpers/stringValidation');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!stringValidation(value))
                throw new Error('Name is invalid');
        }
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('Email is invalid');
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim:true
    },
    country: {
        type: String,
        required:true,
        trim: true,
        validate(value) {
            if(!stringValidation(value))
                throw new Error('Country is invalid');
        }
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'   
    }],
    gender:{
        type: Boolean,
        required: true,
    },
    loginAttempts:{
        type:Number,
        required:true,
        default:0
    },
    lockUntil:{
        type:Number,
        required:true,
        default:1
    },
    date:{
        type: Date,
        default: Date.now
    }
});



userSchema.methods.toJSON = function(){
    //const user = this;
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.loginAttempts;
    delete userObject.lockUntil;
    return userObject;
}


userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const regex = RegExp('^(?=.*[a-z])(?=.*[A-Z])((?=.*[0-9])|(?=.*[!@#\$%\^_&\*]))(?=.{8,})');
        if(regex.test(this.password))
            this.password = await bcrypt.hash(this.password,8);
        else
            throw new Error('Password must contain uppercase, lowercase letters and numbers or special characters');
    }
    next();
});


const User = mongoose.model('User',userSchema);

module.exports = User;