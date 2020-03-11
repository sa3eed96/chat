const UserSocket = require('../models/UserSocket');

const notifyUser = async(io, userName, type, payload) => {
    const socket = await UserSocket.findOne({ userName },'socketId');
    if(socket)
    {
        console.log('notifying user ',userName,' with socketId ',socket.socketId);
        io.to(socket.socketId).emit(`${type}`, payload);
    }
};

module.exports = notifyUser;