const { param,query, body } = require('express-validator/check');

module.exports = (method) => {
    switch(method){
        case 'index': {
            return [
                query('page').isInt(),
            ];
        }
        case 'store': {
            return [
                body('userName').custom(value => {
                    if(/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g.test(value))
                        throw('invalid username');
                    return true;    
                }),
            ];
        }
        case 'delete': {
            return [
                param('id').exists().isMongoId(),
            ];
        }
    }
}