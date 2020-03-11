var express = require('express');
var router = express.Router();
const PasswordController = require('../controllers/PasswordController');
const checkUserAuth = require('../middleware/auth/checkUserAuth');

/* GET home page. */
router.post('/password', checkUserAuth, PasswordController.update);

module.exports = router;