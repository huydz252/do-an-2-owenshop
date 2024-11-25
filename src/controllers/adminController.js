const connection = require("../config/database");
const { Op, where, json } = require('sequelize');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const { getAllCategories } = require('../services/CRUDService')
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const Purchased_product = require('../models/purchased_products')
const { USE } = require("sequelize/lib/index-hints");

const getAdmin = async (req, res) => {
    res.render('admin/admin.ejs')
}

const getProductForm = async (req, res) => {
    try {
        const products = await Product.findAll();
        const data = []
        for (const pro of products) {
            const category_name = await Category.findOne({
                where: { id: pro.dataValues.category_id },
                attributes: ['name']
            })
            data.push({
                id: pro.dataValues.id,
                name: pro.dataValues.name,
                description: pro.dataValues.description,
                price: pro.dataValues.price,
                stock: pro.dataValues.stock,
                category: category_name.dataValues.name,
                image: pro.dataValues.image_url,
                createdAt: dayjs(pro.dataValues.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                updatedAt: dayjs(pro.dataValues.updatedAt).format('DD/MM/YYYY HH:mm:ss'),
                is_active: pro.dataValues.is_active,
            })
        }
        console.log('check: >>>>>>>>>>>>>>>>>>>>', data[0])
        const categories = await getAllCategories(req, res)
        res.render('admin/product.ejs', { rows: data, categories: categories });
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

const getUserForm = async (req, res) => {
    const dataUsers = await User.findAll({
        attributes: ['id', 'name', 'email', 'address']
    });
    let listUser = []
    dataUsers.forEach(user => {
        listUser.push(user.dataValues)
    });
    return res.render('admin/user.ejs', { listUsers: listUser })
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.destroy({
            where: { id: userId }
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.log('error: ', error)
        res.status(500).json({
            success: false,
            message: 'Failed to delete user', error
        })
    }
}

const getPurchased_ProductForm = async (req, res) => {
    const purchased_products = await Purchased_product.findAll()
    let listData = []
    for (const data of purchased_products) {
        let product = await Product.findOne({ where: { id: data.dataValues.id_product } })
        let user = await User.findOne({
            where: { id: data.dataValues.id_user },
            attributes: ['name']
        })
        listData.push({
            id_user: data.dataValues.id_user,
            name_user: user.dataValues.name,
            id_pro: data.dataValues.id_product,
            quantity: data.dataValues.quantity,
            size: data.dataValues.size,
            product: product.dataValues,
            order_date: dayjs(data.dataValues.created_at).format('DD/MM/YYYY HH:mm:ss'),
        })
    }
    return res.render('admin/purchased_product.ejs', { listData: listData })
}



module.exports = {
    getAdmin,
    getProductForm, postEditProduct,
    postAddProduct, deleteDeleteProduct,
    getCategoryForm, postAddCategory,
    postEditCategory, postDeleteCategory,
    getUserForm, deleteUser, getPurchased_ProductForm,
}