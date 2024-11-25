const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const upload = require('../middlewares/upload')

// user
router.get('/admin/userForm', adminController.getUserForm)
router.delete('/admin/userForm/deleteUser/:userId', adminController.deleteUser)

// products
router.get('/admin', adminController.getAdmin)
router.get('/admin/productForm', adminController.getProductForm)
router.post('/admin/productForm/addProduct', upload.single('image_add'), adminController.postAddProduct)
router.post('/admin/productForm/editProduct', upload.single('image_edit'), adminController.postEditProduct)
router.delete('/admin/productForm/deleteProduct/:id', adminController.deleteDeleteProduct)

// category
router.get('/admin/categoryForm', adminController.getCategoryForm)
router.post('/admin/categoryForm/addCategory', adminController.postAddCategory)
router.post('/admin/categoryForm/editCategory', adminController.postEditCategory)
router.post('/admin/categoryForm/deleteCategory', adminController.postDeleteCategory)

//purchased products
router.get('/admin/purchased_productForm', adminController.getPurchased_ProductForm)



module.exports = router;