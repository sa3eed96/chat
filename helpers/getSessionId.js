const cookie = require('cookie');

module.exports = (value)=> {
    let sessionId = cookie.parse(value).ssn_Id;
    const start = sessionId.indexOf(':') + 1;
    sessionId = sessionId.substr(start,sessionId.indexOf('.')-start);
    return sessionId;
}