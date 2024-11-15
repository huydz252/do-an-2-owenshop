const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')

router.get('/', homeController.getHomepage);
router.get('/shop', homeController.getShop);
router.get('/shop/getProDetails/:id', homeController.getProductDetails)
router.post('/shop/getProDetails/addtoCart/:id', homeController.postAddToCart)
router.get('/cart', homeController.getCart)
router.get('/cart/deleteProduct/:id', homeController.deleteProduct)
router.post('/cart/update-cart-total', homeController.updateCartTotal)
router.post('/cart/update-quantity-cart', homeController.updateCartQuantity)
//admin
router.get('/admin/productForm', homeController.getProductForm)
router.get('/admin/categoryForm', homeController.getCategoryForm)
router.post('/admin/productForm/addProduct', homeController.postAddProduct)
router.post('/admin/categoryForm/addCategory', homeController.postAddCategory)

module.exports = router;
