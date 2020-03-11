const Auth = require('../helpers/Auth');
const bcrypt = require('bcryptjs');


module.exports.update = async(req,res,next) => {
    try{
        const user = await Auth.getUser(req.session.user.userName);
        const passCheck = await bcrypt.compare(req.body.old, user.password);
        if(passCheck){
            user.password = req.body.new;
            await user.save();
            return res.status(200).json();
        }
        else
            res.status(400).json({message: 'incorrect password'});
    }catch(err){
        next(err);
    }    
};