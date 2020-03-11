const User = require('../models/User');
const Auth = require('../helpers/Auth');
const stringValidation = require('../helpers/stringValidation');
const bcrypt = require('bcryptjs');
const UserSocket = require('../models/UserSocket');


module.exports.checkPassword = async(req, res, next) => {
    const user = await Auth.getUser(req.session.user.userName);
    const passCheck = await bcrypt.compare(req.body.old, user.password);
    if(passCheck)
        next();
    else
        res.status(400).json({message: 'incorrect password'});
};

module.exports.login = async (req, res, next) => {
    try {
        let check = await UserSocket.findOne({'userName': req.body.userName});
        if(check){
            const err = new Error('You are logged in elsewhere');
            err.statusCode = 400;
            throw err;
        }
        const user = await Auth.getUser(req.body.userName);
        const passCheck = await bcrypt.compare(req.body.password, user.password);
        if (passCheck) {
            Auth.checkAccountStatus(user.lockUntil);
            if (user.loginAttempts !== 0) {
                user.loginAttempts = 0;
                user.lockUntil = 1;
                await user.save();
            }
            req.body.user = user;
            next();
        }
        else {
            if (user.loginAttempts > 4)
                Auth.lockAccount(user);
            user.loginAttempts++;
            await user.save();
            const err = new Error('Email or password are incorrect');
            err.statusCode = 400;
            throw err;
        }
    }
    catch (err) {
        next(err);
    }
};

module.exports.register = (req, res, next) => {
    const user = new User({
        'userName': req.body.userName,
        'email': req.body.email,
        'password': req.body.password,
        'country': req.body.country,
        'gender': req.body.gender,
    });
    user.save().then(user => {
        req.body.user = user;
        next();
    }).catch(err => {
        if(err.code == 11000){
            const error = new Error('Username or Email already exist');
            next(error);
        }
        else {
            const error = new Error('could not create account, try again later');
            next(error);
        }
    });
};

module.exports.logout = (req, res, next) => {
    const userName = req.session.user.userName;
    req.session.destroy(async err => {
        if (err)
            next(new Error('Error logging out'));
        return res.status(200).json();
    });
};

module.exports.duplicateLogout = (req, res, next) => {
    const userName = req.session.user.userName;
    req.session.destroy(async err => {
        if (err)
            next(new Error('Error logging out'));
            
        return res.status(200).json();
    });
};

module.exports.guest= (req, res, next) => {
    if (!stringValidation(req.body.userName) || !stringValidation(req.body.country) || !req.body.hasOwnPropert(gender)){
        const err = new Error('username or Country is invalid');
        err.statusCode = 400;
        next(err);
    }
    req.session.regenerate(err => {
        if (err){
            const error = new Error('Error logging in, try again later.');
            next(error);
        }
        const user = { userName: req.body.userName, country: req.body.country, gender: req.body.gender }
        req.session.user = user;
        return res.json({ user });
    });
};

module.exports.createSession = (req, res, next) => {
    req.session.regenerate(async(err) => {
        if (err){
            const error = new Error('Account created but couldn\'t login, try logging in later.');
            next(error);
        }
        if (req.body.rememberMe)
            req.session.cookie.maxAge = 3600000 * 24 * 7;
        const user = req.body.user;
        req.session.user = user;
        return res.json({ user });
    });
};

module.exports.confirmAuth = (req,res)=>{
    return res.status(200).json({'user': req.session.user });
}

module.exports.checkCon = async(req,res) => {
    const user = await UserSocket.findOne({ userName: req.session.user.userName });
    if(user)
        return res.status(400).json({});
    return res.status(200).json({});
}