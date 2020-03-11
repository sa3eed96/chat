const User = require('../models/User');
const UserSocket = require('../models/UserSocket');
const Room = require('../models/Room');
const { validationResult } = require('express-validator/check');

module.exports = (io, memoryStore) => {
    return {
        index: async(req, res, next) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(422).json({ errors: errors.array() });
                    return;
                }
                if(await Room.find({'name': req.params.room}).length == 0){
                    const err = new Error('Room not found');
                    err.status = 404;
                    next(err);
                }
                io.in(req.params.room).clients( async (err, clients)=>{ 
                    if(err) throw err;  
                    const users = await UserSocket.find({ socketId: { $in: clients } });
                    const usernames = users.map(( {userName} )=> userName);
                    console.log('users: ', usernames.length);
                    const usersInfo = [];
                    memoryStore.all((err, sessions)=>{
                        if(err)
                            console.log(err);
                        for (const sess of Object.keys(sessions)) {
                            if(usernames.includes(sessions[sess].user.userName))
                                usersInfo.push(sessions[sess].user);
                        }
                        console.log('info length: ', usersInfo.length);
                        console.log(usersInfo);
                        return res.status(200).json({ users: usersInfo });
                    });
                });
            }
            catch (err) {
                next(err);
            }
        },
        friendsIndex: async(req, res, next)=>{
            try{
                const user = await User.findById(req.session.user._id).populate('friends', 'userName');
                let friendsUserNames = [];
                user.friends.forEach(element => {
                    friendsUserNames.push(element.userName);
                });
                const onlineFriends = await UserSocket.find({userName: {$in: friendsUserNames}});
                
                const onlineFriendsObject = {};
                onlineFriends.forEach(f => onlineFriendsObject[f.userName] = f.socketId);
                const offlineFriendsObject = {};
                friendsUserNames.forEach(f => {
                    if(!onlineFriendsObject.hasOwnProperty(f)) offlineFriendsObject[f] = 1; 
                });
                return res.status(200).json({ 'offlineFriends': offlineFriendsObject, 'onlineFriends': onlineFriendsObject });
            }catch(err){
                next(err);
            }
        },
        show: async (req,res,next) => {
            try{
                const errors = validationResult(req);
    
                if (!errors.isEmpty())
                    return res.status(422).json({ errors: errors.array() });
                    
                const user = await User.findOne({userName: req.params.userName});
                if(!user){
                    const err = new Error('user not found');
                    err.status = 404;
                    next(err);
                }
                return res.status(200).json({user});
            }catch(err){
                next(err);
            }
        },
        showUserSession: (req, res)=>{
            return res.json({ user: req.session.user });
        },
        update: async(req, res, next) => {
            try{
                const errors = validationResult(req);
    
                if (!errors.isEmpty()) {
                    res.status(422).json({ errors: errors.array() });
                    return;
                }
                await User.findOneAndUpdate({'userName': req.body.oldUserName}, req.body.user);
                await UserSocket.findOneAndUpdate({'userName': req.body.oldUserName},{userName: req.body.user.userName});
                await Room.findOneAndUpdate({'userName': req.body.oldUserName},{userName: req.body.user.userName});
                return res.status(200).json();
            }catch(err){
                next(err);
            }
        }
    };
}