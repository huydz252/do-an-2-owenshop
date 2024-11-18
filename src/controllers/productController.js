const connection = require("../config/database");
const { Op, where, json } = require('sequelize');
const bcrypt = require('bcrypt');
const { getAllProducts, getProductById, updateCartNumber, getAllCategories } = require('../services/CRUDService')
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const { USE } = require("sequelize/lib/index-hints");

const getHomepage = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 20);
        const offset = (page - 1) * limit;

        // Lấy danh sách sản phẩm từ cơ sở dữ liệu
        const products = await Product.findAll({
            limit: limit,
            offset: offset
        });

        const totalProducts = await Product.count();
        const totalPages = Math.ceil(totalProducts / limit);

        // Tính toán số lượng giỏ hàng (nếu có session)
        const cartCount = req.session && req.session.user ? updateCartNumber(req, res) : 0;

        return res.render('home.ejs', {
            rows: products, // Danh sách sản phẩm
            cartCount, // Số lượng giỏ hàng
            currentPage: page, // Trang hiện tại
            totalPages: totalPages, // Tổng số trang
            user: req.session && req.session.user ? req.session.user : null // Người dùng (nếu có)
        });
    } catch (error) {
        console.error('Error fetching products: ', error);
        res.status(500).send('Internal Server Error');
    }
};



const getShop = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const offset = (page - 1) * limit

        const products = await Product.findAll({
            limit: limit,
            offset: offset
        })

        const totalProducts = await Product.count()

        //total page:
        const totalPages = Math.ceil(totalProducts / limit);

        var cartCount = updateCartNumber(req, res)
        return res.render('shop.ejs',
            {
                rows: products,
                cartCount,
                currentPage: page,
                totalPages: totalPages
            });
    } catch (error) {
        console.error('Error fetching products: ', error);
        res.status(500).send('Internal Server Error');
    }

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
    const checked = false;
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
        req.session.cart.push({ id: id, name: name, price: price, image_url: image_url, quantity: quantity, size: size, checked: checked });
    }
    res.redirect('/cart')
};

module.exports = {
    getHomepage, getShop, getProductDetails, postAddToCart
}