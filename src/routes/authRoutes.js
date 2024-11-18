const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.get('/auth/registerForm', authController.getRegisterForm)
router.post('/auth/registerForm/register', authController.postRegister)

router.get('/auth/loginForm', authController.getLoginForm)
router.post('/auth/loginForm/login', authController.postLogin)
router.get('/auth/logout', authController.getLogout)

module.exports = router;