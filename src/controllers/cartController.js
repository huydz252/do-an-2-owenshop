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



const updateCartQuantity = async (req, res) => {
    const id = parseInt(req.body.id)
    const quantity = parseInt(req.body.quantity)
    console.log('check quantity: ', quantity, 'check id: ', id)
    let product = req.session.cart.find(item => item.id == id)
    product.quantity = quantity
    console.log('check product: ', product)

    if (product) {
        product.quantity = quantity;
        if (product.checked) {
            product.totalPrice = quantity * product.price;
        }
    }
    return res.json({ success: true, id: id, quantity: quantity })

}

const updateCheckedProducts = async (req, res) => {
    const checked = req.body.checked;
    const id = parseInt(req.body.id);
    let cart = req.session.cart;

    const checkedProduct = cart.find(pro => pro.id == id);

    if (checkedProduct) {
        checkedProduct.checked = checked;
        console.log('check updateCheckedProducts: ', checkedProduct)
        // Lưu lại session sau khi cập nhật
        req.session.save(err => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ success: false, error: 'Unable to save session' });
            }
            return res.json({ success: true, message: 'Checked status updated successfully' });
        });
    }

};


const getCheckedProducts = async (req, res) => {
    const cart = req.session.cart || []; // Lấy giỏ hàng từ session hoặc mảng rỗng nếu giỏ hàng không tồn tại
    const checkedProducts = cart.filter(product => product.checked == true);
    console.log('check checkedProducts: ', checkedProducts);
    return res.json({ success: true, checkedProducts });
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

        // Tính toán số lượng giỏ hàng (nếu có session)
        const cartCount = req.session && req.session.user ? updateCartNumber(req, res) : 0;

        return res.render('cart/cart_success.ejs', {
            cartCount,
            user: req.session && req.session.user ? req.session.user : null // Người dùng (nếu có)
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        // Tính toán số lượng giỏ hàng (nếu có session)
        const cartCount = req.session && req.session.user ? updateCartNumber(req, res) : 0;

        return res.render('cart/cart_failure.ejs', {
            cartCount,
            user: req.session && req.session.user ? req.session.user : null // Người dùng (nếu có)
        });
    }
};

//lỗi luôn là XL (size) khi thêm vào cart

module.exports = {
    getCart,
    deleteProductCart, updateCartQuantity,
    getCheckedProducts, postPay, updateCheckedProducts
}