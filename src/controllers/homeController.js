const connection = require("../config/database");
const { getAllProducts, getProductById, addCategory, addProduct } = require('../services/CRUDService')
const Product = require('../models/product');
const Category = require('../models/category');

const getHomepage = async (req, res) => {
    let results = await getAllProducts();
    return res.render('home.ejs', { rows: results });
}
const getShop = async (req, res) => {
    let results = await getAllProducts();
    return res.render('shop.ejs', { rows: results });
}
const getProductDetails = async (req, res) => {
    let id = req.params.id;
    let results = await getProductById(id);
    return res.render('productDetails.ejs', { rows: results });

}

const getAddProductForm = async (req, res) => {
    res.render('admin/addProduct.ejs')
}

const getAddCategoryForm = async (req, res) => {
    res.render('admin/addCategory.ejs')
}

const postAddProduct = async (req, res) => {
    const { name, description, price, stock, category_id, image_url } = req.body;
    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            category_id,
            image_url,
            // Sequelize sẽ tự động xử lý createdAt, updatedAt, và is_active
        });

        res.status(201).json({
            message: 'Product added successfully!',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            message: 'Failed to add product.',
            error: error.message,
        });
    }
}
const postAddCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCategory = await Category.create({
            name: name,
            description: description
            // Không cần truyền createdAt và updatedAt, Sequelize tự động xử lý
        })
        res.status(201).json({
            message: 'Category added successfully!',
            category: newCategory,
        });
    } catch (error) {
        console.log('Error adding category: ', error)
        res.status(500).json({
            message: 'failed to add category',
            error: error.message
        })
    }
}

module.exports = {
    getHomepage, getShop,
    getProductDetails, getAddProductForm, getAddCategoryForm,
    postAddProduct, postAddCategory
}   