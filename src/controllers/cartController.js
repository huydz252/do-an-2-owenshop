const connection = require("../config/database");
const { Op, where, json, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const { getAllProducts, getProductById, updateCartNumber, getAllCategories } = require('../services/CRUDService')
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const PurchasedProduct = require("../models/purchased_products");
const { USE } = require("sequelize/lib/index-hints");




const getCart = async (req, res) => {

    if (!req.session.user) {
        return res.redirect('/auth/loginForm')
    } else {
        const cart = req.session.cart || []
        const userId = req.session.user.id
        if (req.session.cart && Array.isArray(req.session.cart)) {
            req.session.cart.forEach(item => {
                item.checked = false; // Đặt lại tất cả trạng thái checked thành false
            });
        }

        var cartCount = updateCartNumber(req, res)

        const myInfo = await User.findOne(
            {
                where: {
                    'id': userId
                },
                attributes: [
                    'id', 'name', 'email', 'cart', 'address', 'phone'
                ]

            }
        )
        const productChecked = await req.session.cart.filter(check => check.checked == true)
        res.render('cart/cart.ejs', { cart: cart, cartCount, myInfo: myInfo, productChecked: productChecked });
    }

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
    let product = req.session.cart.find(item => item.id == id)
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

const getCheckedProducts = async (req, res) => {
    if (req.session.cart) {
        const checkedProducts = req.session.cart.filter(check => check.checked == true)
        return res.json({ success: true, checkedProducts: checkedProducts })
    } else {
        return res.status(400).json({ success: false, message: 'Cart is empty or not initialized' })
    }
}
const postPay = async (req, res) => {
    try {
        // Lấy dữ liệu từ request
        const id_products = [].concat(req.body.id_pay); // ID sản phẩm đã thanh toán
        const quantities = [].concat(req.body.quantity_pay);
        const sizes = [].concat(req.body.size_pay); // Lấy size từ request
        const id_user = req.body.id_user;

        // Kiểm tra đầu vào hợp lệ
        if (!id_user) {
            return res.status(400).send({ success: false, message: 'Invalid user ID' });
        }

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findOne({ where: { id: id_user } });
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        // Duyệt qua tất cả các sản phẩm được thanh toán
        for (let i = 0; i < id_products.length; i++) {
            const productId = id_products[i];
            const quantity = parseInt(quantities[i]);
            const size = sizes[i]; // Lấy size tương ứng với sản phẩm

            // Kiểm tra thông tin sản phẩm tồn tại không
            const product = await Product.findOne({ where: { id: productId } });
            if (!product) {
                return res.status(404).send({ success: false, message: `Product with ID ${productId} not found` });
            }

            // Kiểm tra nếu số lượng sản phẩm trong kho có đủ để bán không
            if (product.stock < quantity) {
                return res.status(400).send({ success: false, message: `Not enough stock for product ID ${productId}` });
            }

            // Giảm số lượng sản phẩm trong kho
            await Product.update(
                { stock: product.stock - quantity },
                { where: { id: productId } }
            );

            // Kiểm tra nếu sản phẩm đã tồn tại trong bảng purchased_products cho user này
            const existingRecord = await PurchasedProduct.findOne({
                where: {
                    id_user: id_user,
                    id_product: productId,
                    size: size, // Kiểm tra cả size để tránh trùng lặp bản ghi cho các size khác nhau
                }
            });

            if (existingRecord) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                await PurchasedProduct.update(
                    {
                        products: JSON.stringify(product), // Lưu thông tin sản phẩm
                        quantity: existingRecord.quantity + quantity, // Cập nhật lại tổng số lượng
                    },
                    {
                        where: {
                            id_user: id_user,
                            id_product: productId,
                            size: size,
                        }
                    }
                );
            } else {
                // Nếu sản phẩm chưa tồn tại, tạo mới một bản ghi
                await PurchasedProduct.create({
                    id_user: id_user,
                    id_product: productId,
                    products: JSON.stringify(product), // Lưu thông tin sản phẩm dưới dạng JSON
                    quantity: quantity, // Số lượng sản phẩm được mua
                    size: size, // Lưu size của sản phẩm
                });
            }
        }

        // Phản hồi thành công
        return res.render('cart/cart_success.ejs')
    } catch (error) {
        console.error('Error processing payment:', error);
        return res.render('cart/cart_failure.ejs')
    }
};

//lỗi luôn là XL (size) khi thêm vào cart

module.exports = {
    getCart,
    deleteProductCart, updateCartTotal, updateCartQuantity,
    getCheckedProducts, postPay
}