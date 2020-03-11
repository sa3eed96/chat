const checkAuth = require('../middleware/auth/checkAuth');
const validate = require('../middleware/validation/user');
const checkUserAuth = require('../middleware/auth/checkUserAuth');

module.exports = (app, io, memoryStore) => {

  const userController = require('../controllers/UserController')(io, memoryStore);
  app.get('/users/room/:room', checkAuth, validate('index'), userController.index);
  app.get('/users/friends', checkUserAuth, userController.friendsIndex);
  app.get('/users/:userName',checkUserAuth, validate('show'), userController.show);
  app.get('/userssession', checkAuth, userController.showUserSession);
  app.post('/users', checkUserAuth, validate('update'), userController.update);
}