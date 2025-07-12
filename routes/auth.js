const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateBody = require('../middleware/validateBody');
const { userSchemas } = require('../middleware/validationSchemas');
const auth = require('../middleware/auth');

router.post('/register', validateBody(userSchemas.register), authController.register);

router.post('/login', validateBody(userSchemas.login), authController.login);

router.post('/logout', auth, authController.logout);

router.post('/send-reset-email', validateBody(userSchemas.sendResetEmail), authController.sendResetEmail);

router.post('/reset-pwd', validateBody(userSchemas.resetPassword), authController.resetPassword);

module.exports = router; 