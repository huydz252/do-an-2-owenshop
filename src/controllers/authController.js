const connection = require("../config/database");
const { Op, where, json } = require('sequelize');
const bcrypt = require('bcrypt');
const { getAllProducts, getProductById, updateCartNumber, getAllCategories } = require('../services/CRUDService')
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const { USE } = require("sequelize/lib/index-hints");

const getRegisterForm = async (req, res) => {
    res.render('auth/register.ejs')
}

const postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        });
        return res.redirect('/auth/login')
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).send('Internal Server Error');
    }
};

const getLoginForm = async (req, res) => {
    const error = req.query.error || '';
    res.render('auth/login.ejs', { error: error })
}

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne(
            {
                where: { email },
                attributes: ['id', 'name', 'password', 'cart']
            }
        );
        if (!user) {
            return res.redirect('/auth/loginForm?error=Email does not exist!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.redirect('/auth/loginForm?error=Password does not exist!');
        }

        let cart = []
        try {
            cart = JSON.parse(user.cart)    //chuyen thanh mang
        } catch (error) {
            console.error("Error parsing cart JSON:", error);
            cart = [];
        }
        req.session.user = { id: user.id, name: user.name };
        req.session.cart = cart || [];

        return res.redirect('/');
    } catch (error) {
        console.log('Error:', error);
        return res.redirect('/auth/loginForm?error=An error occurred during login!');
    }
};

const getLogout = async (req, res) => {
    try {

        if (req.session.user && req.session.cart) {
            await User.update(
                { cart: req.session.cart },
                { where: { id: req.session.user.id } }
            )
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("Error while destroying session:", err);
                return res.redirect('/');
            }
            res.clearCookie('connect.sid'); // Xóa cookie session
            return res.redirect('/');
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.redirect('/');
    }
};

module.exports = {
    getRegisterForm, postRegister, getLoginForm, postLogin, getLogout
}