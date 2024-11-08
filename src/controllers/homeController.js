const connection = require("../config/database");
const { Op } = require('sequelize');
const { getAllProducts, getProductById, updateCartNumber } = require('../services/CRUDService')
const Product = require('../models/product');
const Category = require('../models/category');

const getHomepage = async (req, res) => {
    let results = await getAllProducts(req, res);
    var cartCount = updateCartNumber(req, res)
    return res.render('home.ejs', { rows: results, cartCount });
}
const getShop = async (req, res) => {
    let results = await getAllProducts(req, res);
    var cartCount = updateCartNumber(req, res)
    return res.render('shop.ejs', { rows: results, cartCount });
}
const getProductDetails = async (req, res) => {
    let id = req.params.id;
    var cartCount = updateCartNumber(req, res)
    try {
        const product = await Product.findOne({
            where: { id: id },
            attributes: ['id', 'name', 'description', 'price', 'stock', 'image_url', 'category_id'],
        });
        // lấy category --> in sp cùng loại
        let relatedProducts = [];
        relatedProducts = await Product.findAll({
            where: {
                category_id: product.category_id,
                id: { [Op.ne]: id } // Điều kiện này đảm bảo không lấy sản phẩm có id giống id của sản phẩm hiện tại
            },
            attributes: ['id', 'name', 'price', 'description', 'image_url'],
        });

        let randomRelatedProducts = [];
        if (relatedProducts && relatedProducts.length > 0) {
            // Hàm random để lấy 3 sản phẩm ngẫu nhiên
            const getRandomProducts = (products, num) => {
                // Tạo một bản sao của mảng để tránh thay đổi mảng gốc
                let shuffled = [...products];

                // Thuật toán Fisher-Yates Shuffle để trộn mảng
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1)); // Chọn một chỉ số ngẫu nhiên
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Hoán đổi phần tử
                }

                // Trả về 3 sản phẩm ngẫu nhiên
                return shuffled.slice(0, num);
            };

            // Lấy 3 sản phẩm ngẫu nhiên
            randomRelatedProducts = getRandomProducts(relatedProducts, 3);
        }

        //lấy all category --> in ra gợi ý sp khác
        let listCategory = [];
        listCategory = await Category.findAll({
            attributes: ['id']
        })
        function getRandomElement(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        //lấy all pro với category = randomCategory (other products)
        let randomCategory;
        let otherProducts;
        // nếu listCategory có chứa category_id khác id của sp hiện tại thì thực hiện random
        if (listCategory.length > 1) {
            do {
                randomCategory = getRandomElement(listCategory)
            } while (
                randomCategory.id === product.category_id
            )
            otherProducts = await Product.findAll({
                where: {
                    'category_id': randomCategory.id
                },
                attributes: ['id', 'name', 'price', 'description', 'image_url']
            })
        }
        if (product) {
            return res.render('proDetails.ejs', {
                rows: product,
                threeRelatedProducts: randomRelatedProducts,
                relatedProducts: relatedProducts,
                otherProducts: otherProducts, cartCount
            });
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ message: 'Error fetching product' });
    }
};

const postAddToCart = async (req, res) => {
    const id = req.params.id
    const size = req.body.size
    const quantity = parseInt(req.body.quantity)
    const product = await getProductById(req, res)
    const name = product.name;
    const price = product.price;
    const image_url = product.image_url;
    if (!req.session.cart) {
        req.session.cart = []; // Tạo giỏ hàng trống
    }
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProduct = req.session.cart.find(item => item.id === id);
    if (existingProduct) {
        // Nếu đã có, cập nhật số lượng
        existingProduct.quantity += quantity;
    } else {
        // Nếu chưa có, thêm sản phẩm vào giỏ hàng
        req.session.cart.push({ id: id, name: name, price: price, image_url: image_url, quantity: quantity, size: size });
    }
    res.redirect('/cart')
};

const getCart = async (req, res) => {
    const cart = req.session.cart || []
    var cartCount = updateCartNumber(req, res)
    res.render('cart.ejs', { cart: cart, cartCount });
}

const deleteProduct = (req, res) => {
    const productId = req.params.id;

    if (!req.session.cart) {
        return res.send('Giỏ hàng trống');
    }

    req.session.cart = req.session.cart.filter(item => item.id !== productId);
    res.redirect('/cart')
}


// admin
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
    postAddProduct, postAddCategory, getCart, postAddToCart,
    deleteProduct
}   