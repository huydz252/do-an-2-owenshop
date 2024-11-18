const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const upload = require('../middlewares/upload')

router.get('/admin', adminController.getAdmin)
router.get('/admin/productForm', adminController.getProductForm)
router.post('/admin/productForm/addProduct', upload.single('image_add'), adminController.postAddProduct)
router.post('/admin/productForm/editProduct', upload.single('image_edit'), adminController.postEditProduct)
router.delete('/admin/productForm/deleteProduct/:id', adminController.deleteDeleteProduct)
router.get('/admin/categoryForm', adminController.getCategoryForm)
router.post('/admin/categoryForm/addCategory', adminController.postAddCategory)
router.post('/admin/categoryForm/editCategory', adminController.postEditCategory)
router.post('/admin/categoryForm/deleteCategory', adminController.postDeleteCategory)


module.exports = router;