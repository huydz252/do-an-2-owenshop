const { Op, where, json, Sequelize, DataTypes } = require('sequelize');
const { getProductById, updateCartNumber } = require('../services/CRUDService');
const Product = require('../models/product');
const Category = require('../models/category');



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
        return res.render('shop/shop.ejs',
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

        let listCategory = [];
        listCategory = await Category.findAll({
            attributes: ['id']
        })
        function getRandomElement(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        let randomCategory;
        let otherProducts;

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
            return res.render('shop/proDetails.ejs', {
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

const postSearch = async (req, res) => {
    try {
        const keyword = req.query.name || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Tìm kiếm sản phẩm
        const { rows: products, count } = await Product.findAndCountAll({
            where: {
                name: {
                    [Op.like]: `%${keyword}%`
                }
            },
            attributes: ['id', 'name', 'description', 'price', 'stock', 'category_id', 'image_url'],
            limit: limit,
            offset: offset
        })
        // console.log('check results: ', products)

        const totalPages = Math.ceil(count / limit);
        var cartCount = updateCartNumber(req, res)

        //lấy all category --> in ra gợi ý sp khác
        let listCategory = await Category.findAll({
            attributes: ['id']
        })
        function getRandomElement(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
        //lấy all pro với category = randomCategory (other products)
        let similarProducts = []
        let randomCategory = {}
        if (listCategory.length > 1) {
            do {
                randomCategory = getRandomElement(listCategory);
            } while (products.length > 0 && randomCategory.id === products[0].category_id);
            similarProducts = await Product.findAll({
                where: {
                    'category_id': randomCategory.id
                },
                limit: limit
            })
        }
        // console.log('check other products', similarProducts)

        res.render('common/search', {
            products: products,
            currentPage: page,
            totalPages: totalPages,
            keyword: keyword,
            cartCount: cartCount,
            similarProducts: similarProducts
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
};

module.exports = {
    getShop, getProductDetails, postAddToCart,
    postSearch
}