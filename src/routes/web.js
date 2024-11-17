const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')
const upload = require('../middlewares/upload')

router.get('/', homeController.getHomepage);
router.get('/shop', homeController.getShop);
router.get('/shop/proDetails/:id', homeController.getProductDetails)
router.post('/shop/proDetails/addtoCart/:id', homeController.postAddToCart)
router.get('/cart', homeController.getCart)
router.get('/cart/deleteProduct/:id', homeController.deleteProductCart)
router.post('/cart/update-cart-total', homeController.updateCartTotal)
router.post('/cart/update-quantity-cart', homeController.updateCartQuantity)

//admin
router.get('/admin', homeController.getAdmin)
router.get('/admin/productForm', homeController.getProductForm)
router.post('/admin/productForm/addProduct', upload.single('image_add'), homeController.postAddProduct)
router.post('/admin/productForm/editProduct', upload.single('image_edit'), homeController.postEditProduct)
router.delete('/admin/productForm/deleteProduct/:id', homeController.deleteDeleteProduct)
router.get('/admin/categoryForm', homeController.getCategoryForm)
router.post('/admin/categoryForm/addCategory', homeController.postAddCategory)
router.post('/admin/categoryForm/editCategory', homeController.postEditCategory)
router.post('/admin/categoryForm/deleteCategory', homeController.postDeleteCategory)



module.exports = router;
