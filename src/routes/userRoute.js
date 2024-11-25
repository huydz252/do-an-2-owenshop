const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/user/myInfo', userController.getMyInfo)
router.post('/user/myInfo/editUser', userController.postEditUser)

module.exports = router;