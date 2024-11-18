const connection = require("../config/database");
const { Op, where, json } = require('sequelize');
const bcrypt = require('bcrypt');
const { getAllProducts, getProductById, updateCartNumber, getAllCategories } = require('../services/CRUDService')
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const { USE } = require("sequelize/lib/index-hints");



const getCart = async (req, res) => {
    const cart = req.session.cart || []
    var cartCount = updateCartNumber(req, res)
    res.render('cart.ejs', { cart: cart, cartCount });
}

const deleteProductCart = (req, res) => {
    const productId = req.params.id;

    if (!req.session.cart) {
        return res.send('Giỏ hàng trống');
    }
    req.session.cart = req.session.cart.filter(item => item.id !== productId);
    res.redirect('/cart')
}

const updateCartTotal = async (req, res) => {
    //lấy cả id, checked để sau update tính năng thanh toán --> có hiện các sp đã checked
    let { id, total, checked } = req.body
    req.session.totalPrice = total
    let product = req.session.cart.find(item => item.id === id)
    if (product) {
        product.checked = checked
    }
    return res.json({ success: true, id: id, total: total, checked: checked })
}

const updateCartQuantity = async (req, res) => {
    const { id, quantity } = req.body
    let product = req.session.cart.find(item => item.id === id)
    product.quantity = quantity
    if (product) {
        product.quantity = quantity;
        if (product.checked) {
            product.totalPrice = quantity * product.price;
        }
    }
    return res.json({ success: true, id: id, quantity: quantity })

}

module.exports = {
    getCart,
    deleteProductCart, updateCartTotal, updateCartQuantity,
}