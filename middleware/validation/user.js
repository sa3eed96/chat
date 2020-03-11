const { param, body } = require('express-validator/check');

module.exports = (method) => {
    switch(method){
        case 'index':{
            return [
                param('room').exists().custom(value => {
                    if(/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g.test(value))
                        throw new Error('invalid room name');
                    return true;
                }),
            ];
        }
        case 'show': {
            return [
                param('userName').exists().custom(value => {
                    if(/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g.test(value))
                        throw('invalid  username');
                    return true;
                }),
            ];
        }
        case 'update': {
            return [
                body('oldUserName').exists().custom(value => {
                    if(/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g.test(value))
                        throw('invalid  username');
                    return true;
                }),
            ];
        }

    }
}