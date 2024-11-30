
const { updateCartNumber } = require('../services/CRUDService');
const Product = require('../models/product');


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

        return res.render('common/home.ejs', {
            rows: products,
            cartCount,
            currentPage: page,
            totalPages: totalPages,
            user: req.session && req.session.user ? req.session.user : null // Người dùng (nếu có)
        });
    } catch (error) {
        console.error('Error fetching products: ', error);
        res.status(500).send('Internal Server Error');
    }
};

const getContact = (req, res) => {
    try {
        // Tính toán số lượng giỏ hàng (nếu có session)
        const cartCount = req.session && req.session.user ? updateCartNumber(req, res) : 0;

        return res.render('common/contact.ejs', {
            cartCount,
            user: req.session && req.session.user ? req.session.user : null // Người dùng (nếu có)
        });
    } catch (error) {
        console.error('Error fetching products: ', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getHomepage, getContact
}