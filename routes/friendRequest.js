const checkUserAuth = require('../middleware/auth/checkUserAuth');
const validate = require('../middleware/validation/friend');

module.exports = (app, io) => {

  const FriendRequestController = require('../controllers/FriendRequestController')(io);
  app.get('/requests', checkUserAuth, validate('index'), FriendRequestController.index);
  app.post('/requests', checkUserAuth, validate('store'), FriendRequestController.store);
  app.patch('/requests',checkUserAuth, FriendRequestController.update);
  app.delete('/requests/:id',checkUserAuth, validate('delete'), FriendRequestController.delete);
}