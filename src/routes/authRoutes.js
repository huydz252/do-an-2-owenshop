const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

//user
router.get('/auth/registerForm', authController.getRegisterForm)
router.post('/auth/registerForm/register', authController.postRegister)
router.get('/auth/loginForm', authController.getLoginForm)
router.post('/auth/loginForm/login', authController.postLogin)
router.get('/auth/logout', authController.getLogout)

//admin
router.get('/auth/adminRegisterForm', authController.getAdminRegisterForm)
router.post('/auth/adminRegisterForm/adminRegister', authController.postAdminRegister)
router.get('/auth/adminLoginForm', authController.getAdminLogin)
router.post('/auth/adminLoginForm/adminLogin', authController.postAdminLogin)

module.exports = router;