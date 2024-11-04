const connection = require('../config/database');
const getAllProducts = async (req, res) => {
    query = 'SELECT id, name, price, description, image, category FROM products;'
    let [rows, fields] = await connection.query(query);
    return res.status(200).json({
        message: 'ok',
        data: rows
    });
}
const createNewProduct = async (req, res) => {
    try {
        let { name, price, description, image, category } = req.body;
        if (!name || !price || !description || !image || !category) {
            return res.status(400).json({
                message: 'Missing required parameters'
            });
        }

        const query = 'INSERT INTO products (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)';
        let [rows] = await connection.execute(query, [name, price, description, image, category]);

        return res.status(200).json({
            message: 'Product created successfully',
            results: rows.insertId
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(200).json({
            message: 'Internal server error'
        });
    }
}


module.exports = {
    getAllProducts, createNewProduct
}