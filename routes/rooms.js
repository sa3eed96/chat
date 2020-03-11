const checkUserAuth = require('../middleware/auth/checkUserAuth');
const checkAuth = require('../middleware/auth/checkAuth');
const validate = require('../middleware/validation/room');

module.exports = (app, io) => {
    const RoomController = require('../controllers/RoomController')(io);

    app.get('/rooms', checkAuth, RoomController.index);
    app.post('/rooms', checkUserAuth, validate('store'), RoomController.store);
    app.delete('/rooms/:room', checkUserAuth, validate('destroy'), RoomController.destroy);
  }