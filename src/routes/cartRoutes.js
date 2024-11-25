const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')

router.get('/cart', cartController.getCart)
router.get('/cart/deleteProduct/:id', cartController.deleteProductCart)
router.post('/cart/update-cart-total', cartController.updateCartTotal)
router.post('/cart/update-quantity-cart', cartController.updateCartQuantity)
router.get('/cart/getCheckedProducts', cartController.getCheckedProducts)
router.post('/cart/pay', cartController.postPay)

module.exports = router;