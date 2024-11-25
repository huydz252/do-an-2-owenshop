const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')

router.get('/', productController.getHomepage);
router.get('/shop', productController.getShop);
router.get('/shop/proDetails/:id', productController.getProductDetails)
router.post('/shop/proDetails/addtoCart/:id', productController.postAddToCart)
router.get('/search', productController.postSearch)

module.exports = router;