const connection = require("../config/database");
const { Op, where } = require('sequelize');
const { getAllProducts, getProductById, updateCartNumber, getAllCategories } = require('../services/CRUDService')
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


// admin
const getAdmin = async (req, res) => {
    res.render('admin/admin.ejs')
}

const getProductForm = async (req, res) => {
    try {
        const products = await Product.findAll();  // Lấy tất cả sản phẩm
        const categories = await getAllCategories(req, res)
        res.render('admin/product.ejs', { rows: products, categories: categories });  // Gửi dữ liệu sản phẩm đến view
    } catch (error) {
        console.error('Error fetching products: ', error);
        res.status(500).json({
            message: 'Failed to fetch products',
            error: error.message
        });
    }
}


const postAddProduct = async (req, res) => {
    const { name_add, description_add, price_add, stock_add, category_id_add, is_active_add } = req.body;

    // Kiểm tra xem ảnh có được tải lên không
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    // Lấy đường dẫn file ảnh
    const imageUrl = `${req.file.filename}`;

    // Chuyển đổi giá trị is_active từ string sang boolean (1 hoặc 0)
    const is_active = (is_active_add === 'true' || is_active_add === true) ? 1 : 0;

    try {
        // Thêm sản phẩm vào cơ sở dữ liệu
        const newProduct = await Product.create({
            name: name_add,
            description: description_add,
            price: price_add,
            stock: stock_add,
            category_id: category_id_add,
            image_url: imageUrl,  // Lưu đường dẫn ảnh
            is_active: is_active
        });

        // Quay lại trang quản lý sản phẩm
        return res.redirect("/admin/productForm/");
    } catch (error) {
        console.log('Error adding product: ', error);
        res.status(500).json({
            message: 'Failed to add product',
            error: error.message
        });
    }
};

const postEditProduct = async (req, res) => {
    const { id_edit, name_edit, description_edit, price_edit, stock_edit, category_id_edit, is_active_edit } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }
    const imageUrl = `${req.file.filename}`;
    const is_active = (is_active_edit === 'true' || is_active_edit === true) ? 1 : 0;
    console.log(id_edit, name_edit, description_edit, price_edit, stock_edit, category_id_edit, is_active_edit)

    try {
        const updatedProduct = await Product.update(
            {
                name: name_edit,
                description: description_edit,
                price: price_edit,
                stock: stock_edit,  // Cập nhật số lượng tồn kho
                category_id: category_id_edit,
                image_url: imageUrl,  // Cập nhật URL ảnh
                is_active: is_active
            },
            {
                where: { id: id_edit }  // Cập nhật sản phẩm theo ID
            }
        );

        return res.redirect("/admin/productForm/");  // Chuyển hướng về trang quản lý sản phẩm sau khi chỉnh sửa
    } catch (error) {
        console.log('Error editing product: ', error);
        res.status(500).json({
            message: 'Failed to edit product',
            error: error.message
        });
    }
}

const deleteDeleteProduct = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    try {
        const deleteProduct = await Product.destroy({
            where: { id: id }  // Xóa sản phẩm theo ID
        });

        return res.redirect("/admin/productForm/");  // Chuyển hướng lại trang quản lý sản phẩm
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the product",
        });
    }
}



const getCategoryForm = async (req, res) => {
    let getAllCategory = await getAllCategories();
    res.render('admin/category.ejs', { rows: getAllCategory })
}

const postAddCategory = async (req, res) => {
    const { name_add, description_add, is_active_add } = req.body;
    let is_active = (is_active_add === 'true' || is_active_add === true) ? 1 : 0;
    try {
        const newCategory = await Category.create({
            name: name_add,
            description: description_add,
            is_active: is_active
        })
        return res.redirect("/admin/categoryForm/");
    } catch (error) {
        console.log('Error adding category: ', error)
        res.status(500).json({
            message: 'failed to add category',
            error: error.message
        })
    }
}

const postEditCategory = async (req, res) => {
    let { id_edit, name_edit, description_edit, is_active_edit } = req.body
    let is_active = (is_active_edit === 'true' || is_active_edit === true) ? 1 : 0;

    try {
        const editCategory = await Category.update(
            {
                name: name_edit,
                description: description_edit,
                is_active: is_active
            },
            {
                where: { id: id_edit }
            }
        )
        return res.redirect("/admin/categoryForm/");
    } catch (error) {
        console.log('Error edit category: ', error)
        res.status(500).json({
            message: 'failed to edit category',
            error: error.message
        })
    }

}

const postDeleteCategory = async (req, res) => {
    try {
        const id = req.body.id;

        // Kiểm tra nếu ID hợp lệ
        if (!id) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ" });
        }

        // Xóa danh mục từ cơ sở dữ liệu
        const deleteCategory = await Category.destroy({
            where: { id: id },
        });
        return res.redirect("/admin/categoryForm/");
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi xóa danh mục",
        });
    }
};

module.exports = {
    getHomepage, getShop,
    getProductDetails, getProductForm, getCategoryForm,
    postAddProduct, postAddCategory, getCart, postAddToCart,
    deleteProductCart, updateCartTotal, updateCartQuantity, postEditCategory,
    postDeleteCategory, postEditProduct, deleteDeleteProduct, getAdmin
}   