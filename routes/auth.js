var express = require('express');
var router = express.Router();
const AuthController = require('../controllers/AuthController');
const checkUserAuth = require('../middleware/auth/checkUserAuth');
const checkAuth = require('../middleware/auth/checkAuth');

router.post('/register', AuthController.register, AuthController.createSession);
router.post('/login', AuthController.login, AuthController.createSession);
router.post('/guest',AuthController.guest);
router.get('/logout', checkAuth, AuthController.logout);
router.get('/duplicateLogout', checkUserAuth, AuthController.duplicateLogout);
router.get('/isAuth', checkAuth, AuthController.confirmAuth);
router.get('/checkConnection', checkAuth, AuthController.checkCon);

module.exports = router;
