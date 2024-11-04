const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')

router.get('/', homeController.getHomepage);
router.get('/shop', homeController.getShop);
router.get('/login', homeController.getLogin)
router.get('/adminLogin', homeController.getAdminLogin)
router.get('/admin/addProducts', homeController.getAdminAddProducts)

module.exports = router;
