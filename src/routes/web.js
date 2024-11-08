const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')

router.get('/', homeController.getHomepage);
router.get('/shop', homeController.getShop);
router.get('/shop/getProDetails/:id', homeController.getProductDetails)
router.post('/shop/getProDetails/addtoCart/:id', homeController.postAddToCart)
router.get('/cart', homeController.getCart)
router.get('/cart/deleteProduct/:id', homeController.deleteProduct)

//admin
router.get('/admin/addProductForm', homeController.getAddProductForm)
router.get('/admin/addCategoryForm', homeController.getAddCategoryForm)
router.post('/admin/addProductForm/addProduct', homeController.postAddProduct)
router.post('/admin/addCategoryForm/addCategory', homeController.postAddCategory)

module.exports = router;
