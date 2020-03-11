const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const UserSocket = require('../models/UserSocket');
const notifyUser = require('../helpers/notifyUser');
const { validationResult } = require('express-validator/check');

module.exports = io => {
    return {
        index: async(req, res, next) => {
            const errors = validationResult(req);
        
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const skip = parseInt(req.query.page ? req.query.page : 1) - 1;
            try{
                const requests = await FriendRequest.find({ $or: [{'reciever': req.session.user._id}, {'sender': req.session.user._id}] },'read', { limit: 5, skip })
                                        .sort({'date': -1})
                                        .populate('reciever','_id userName').populate('sender','_id userName');
                return res.status(200).json({ requests });
            }catch(err){
                next(err);
            }
        },
        store: async(req, res, next) => {
            try {
                const errors = validationResult(req);
        
                if (!errors.isEmpty()) {
                    res.status(422).json({ errors: errors.array() });
                    return;
                }
                const recieverUser = await User.findOne({userName: req.body.userName},'_id friends');

                if(req.session.user.friends.includes(recieverUser._id) || recieverUser.friends.includes(req.session.user._id))
                    return res.status(200).json({'friends': 'true'});
                
                let request = await FriendRequest.find({
                    $and:[
                        {$or: [{'sender': req.session.user._id}, {'reciever': req.session.user._id} ]}
                        ,
                        {$or: [ {'sender': recieverUser._id}, {'reciever': recieverUser._id} ]}
                    ]
                });
                if(request.length > 0)
                    return res.status(200).json({'status': 'pending'});
                request = new FriendRequest({sender: req.session.user._id, reciever: recieverUser._id});
                await request.save();
                await request.populate('reciever','_id userName').populate('sender','_id userName').execPopulate();
                notifyUser(io, req.body.userName,'friendRequest',{ request });
                return res.status(201).json();
            }catch(err){
                next(err);
            }
        },
        delete: async(req, res, next) => {
            try{
                const errors = validationResult(req);
        
                if (!errors.isEmpty()) {
                    res.status(422).json({ errors: errors.array() });
                    return;
                }
                const request = await FriendRequest.findById(req.params.id);
                
                if(req.query.response == 'true'){
                    const sender = await User.findById(request.sender);
                    const reciever = await User.findById(request.reciever);

                    sender.friends.push(reciever._id);
                    reciever.friends.push(sender._id);

                    const socket = await UserSocket.findOne({ userName: sender.userName });
                    const mySocket = await UserSocket.findOne({ userName: req.session.user.userName});
                    if(socket){
                        io.to(socket.socketId).emit('addToMyFriends',{ userName: mySocket.userName, socketId: mySocket.socketId, sender: true, online: true });
                        io.to(mySocket.socketId).emit('addToMyFriends', {userName: socket.userName,socketId: socket.socketId, sender: false, online: true});
                    }
                    else
                        io.to(mySocket.socketId).emit('addToMyFriends', {userName: socket.userName,socketId: null, sender: false, online: false});
                    await sender.save();
                    await reciever.save();
                }
                await request.delete();
            
                return res.status(200).json();
            }catch(err){
                next(err);
            }
        },
        update: async(req, res, next)=>{
            try{
                await FriendRequest.update({'_id':{ $in: req.body.ids }, 'reciever': req.session.user._id},{ 'read': true });
                return res.status(200).json();
            }catch(err){
                next(err);
            }
        }
    };
}