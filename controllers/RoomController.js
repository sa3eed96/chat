const Room = require('../models/Room');
const { validationResult } = require('express-validator/check');

module.exports = io => {
    return {
        index: async (req, res) => {
            const rooms = await Room.find();
            return res.json({ rooms });
        },
        store: async (req, res, next) => {
           try{
                const errors = validationResult(req);
        
                if (!errors.isEmpty()) {
                    res.status(422).json({ errors: errors.array() });
                    return;
                }
                let room = await Room.findOne({userId:req.session.user.userName}, 'name');
                if(room) return res.status(400).send({message: `only one room can be created, you own ${room.name} room`})
                room = new Room({
                    name: req.body.newRoomName,
                    userName: req.session.user.userName
                });
                await room.save();
                io.sockets.sockets[req.session.user.socketId].leave(req.body.currentRoomName);
                io.sockets.sockets[req.session.user.socketId].join(room.name);
                io.to(req.body.currentRoomName).emit('roomLeave',{userName: req.session.user.userName});
                return res.status(201).json();
            }catch(err){
                next(err);
            }
        },
        destroy: async (req, res, next) => {
            try{
                const errors = validationResult(req);
    
                if (!errors.isEmpty()) {
                    res.status(422).json({ errors: errors.array() });
                    return;
                }
                const deleted = await Room.findOneAndDelete({'name': req.params.room, 'userName': req.session.user.userName});
                if(deleted){
                    io.in(req.params.room).clients( async (err, clients)=>{ 
                        if(err) throw err;
                        for (const client of clients) {
                            io.sockets.sockets[client].leave(req.params.room);
                            io.sockets.sockets[client].join('public');
                            io.to(client).emit('roomDeleted',req.params.room);
                        }
                    });
                    return res.status(204).json();
                }
                else return res.status(404).json();
            }catch(err){
                next(err);
            }
        }
    }
}