const connection = require("../config/database");
const Product = require('../models/product');
const Category = require('../models/category');
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'description', 'price', 'stock', 'image_url']
        })
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
}
const getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findOne({
            where: { id: productId },
            attributes: ['id', 'name', 'description', 'price', 'stock', 'image_url'],
        });
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

const updateCartNumber = (req, res) => {
    let cartCount = 0;
    const cart = req.session.cart || []
    cart.forEach(element => {
        cartCount += element.quantity;
    });
    return cartCount;
}


module.exports = {
    getAllProducts, getProductById,
    updateCartNumber
}