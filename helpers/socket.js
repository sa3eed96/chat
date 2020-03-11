const UserSocket = require('../models/UserSocket');
const Room = require('../models/Room');

module.exports = (io, socket) => {
        console.log('connected');
        socket.join('public');

        socket.on('sendMessage',({message, room, userName})=>{
            io.to(room).emit('newMessage',{message, userName});
        });

        socket.on('sendPrivateMessage',({message, room, userName})=>{
            io.to(room).emit('recievePrivateMessage',{message, userName, room});
        });

        socket.on('joinUserSocket',({userSocket, senderUserName, recieverUserName})=>{
            io.to(userSocket).emit('confirmJoinUserSocket',{socket: socket.id, senderUserName, recieverUserName});
        });

        socket.on('privateJoinConfirmed',({userSocket, recieverUserName, senderUserName})=>{
            io.to(socket.id).emit('createPrivateChat',{userSocket: userSocket, userName: senderUserName, senderUserName, recieverUserName});
            io.to(userSocket).emit('createPrivateChat',{userSocket: socket.id, userName: recieverUserName, senderUserName, recieverUserName});
        });

        socket.on('privateChatJoin',({senderUserName, recieverUserName})=>{
            socket.join(`${senderUserName}-${recieverUserName}`);
        });

        socket.on('roomJoinRequest',async (data)=>{
            console.log('got room join with ', data.user);
            const room = await Room.find({'name': data.roomName});
            socket.join(data.roomName);
            socket.broadcast.to(data.roomName).emit('roomJoin',{user: data.user,socketId: socket.id, isRegistered: data.isRegistered});
        });

        socket.on('roomLeaveRequest',async (data)=>{
            const room = await Room.find({'name': data.roomName});
            socket.broadcast.to(data.roomName).emit('roomLeave',{userName: data.userName});
            socket.leave(data.roomName);
        });

        socket.on('disconnect', async (reason) => {
            console.log('user disconnected');
            const userName = (await UserSocket.findOne({'socketId': socket.id},'userName')).userName; 
            io.emit('newMessage',{message:`${userName} Disconnected`,userName});
            io.emit('userDisconnected',{socketId: socket.id, userName});
            await UserSocket.deleteOne({'socketId': socket.id});
        });

        socket.on('sendImage',({ userName, image, room})=>{
            io.to(room).emit('newImage', { userName, image: image.toString('base64'), room });
        });

        socket.on('endConnection',async ()=>{
                const userName = (await UserSocket.findOne({'socketId': socket.id},'userName')).userName; 
                socket.disconnect(true);
                io.emit('newMessage',{message:`${userName} Disconnected`,userName});
                io.emit('userDisconnected',{socketId: socket.id, userName});
                
                await UserSocket.deleteOne({'userName': userName});
        });

        socket.on('chatClosed', ({room})=>{
            io.to(room).emit('chatClosed');
        });
}