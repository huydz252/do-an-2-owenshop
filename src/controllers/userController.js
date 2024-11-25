const { Op, where, json, Sequelize, DataTypes } = require('sequelize');
const { getProductById, updateCartNumber } = require('../services/CRUDService');

const User = require('../models/user');
const PurchasedProduct = require('../models/purchased_products');

const getMyInfo = async (req, res) => {
    const cart = req.session.cart || []
    var cartCount = updateCartNumber(req, res)
    const userId = req.session.user.id

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

    const myPurchasedProducts = await PurchasedProduct.findAll(
        {
            where: { id_user: userId }
        }
    )
    let purchasedProductsData = []
    myPurchasedProducts.forEach(purchasedProduct => {
        let productInfo = JSON.parse(purchasedProduct.dataValues.products)
        let productQuantity = JSON.parse(purchasedProduct.dataValues.quantity)
        let productSize = purchasedProduct.dataValues.size
        purchasedProductsData.push({ products: productInfo, productQuantity, productSize })
    })
    console.log('check: ', purchasedProductsData[2])

    res.render('user/myInfo.ejs', { myInfo: myInfo, cart: cart, cartCount, purchasedProductsData: purchasedProductsData })
}
const postEditUser = async (req, res) => {
    try {
        const { id_edit, name_edit, email_edit, address_edit, phone_edit } = req.body
        const checkUserEmail = await User.findOne({
            where: {
                email: email_edit,
                id: {
                    [Op.ne]: id_edit
                }
            }
        })
        if (checkUserEmail == null) {
            const editUser = await User.update(
                {
                    name: name_edit,
                    email: email_edit,
                    address: address_edit,
                    phone: phone_edit
                },
                {
                    where: { 'id': id_edit }
                }
            )
            return res.redirect('/user/myInfo')
        } else {
            return res.status(400).json({ message: 'Error edit info' });
        }

    } catch (error) {
        console.log('error: ', error)
    }
}

module.exports = {
    getMyInfo, postEditUser
}