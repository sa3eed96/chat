const { param, body } = require('express-validator/check');

module.exports = (method) => {
    switch(method){
        case 'store': {
            return [
                body('newRoomName').custom(value => {
                    if(/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g.test(value))
                        throw('invalid new room name');
                    return true;
                }),
                body('currentRoomName').custom(value => {
                    if(/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g.test(value))
                        throw('invalid room name');
                    return true;    
                }),
            ];
        }
        case 'destroy': {
            return [
                param('room').custom(value => {
                    if(/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g.test(value))
                        throw('invalid room name');
                    return true;    
                }),
            ];
        }
    }
}