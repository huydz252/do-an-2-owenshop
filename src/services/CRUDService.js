const connection = require("../config/database");
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'description', 'price', 'stock']
        })
        return res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
}
const getProductById = async (req, res) => {
    const productId = req.params.id; // Lấy id từ params

    try {
        const product = await Product.findOne({
            where: { id: productId },
            attributes: ['id', 'name', 'price', 'description'], // Chỉ định các trường cần lấy
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};




module.exports = {
    getAllProducts, getProductById,
}