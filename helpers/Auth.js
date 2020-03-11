const User = require('../models/User');

exports.getUser = async (userName) => {
    const user = await User.findOne({userName});
    if(!user) throw new Error('username or password is incorrect');
    return user;
}

exports.checkAccountStatus = async lockUntil =>{
    const date = new Date();
    if(date.getTime() < lockUntil)
        throw new Error('Account Locked for reaching maximum attempts');
};

exports.lockAccount = async user =>{
    const date = new Date();
    user.loginAttempts = 0;
    user.lockUntil = date.getTime() + 2*3600*1000;
    await user.save();
    const err =  new Error('Account Locked for reaching maximum attempts');
    err.statusCode = 400;
    throw err;
}