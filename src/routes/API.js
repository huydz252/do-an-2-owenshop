const express = require('express');
const router = express.Router();

const APIController = require('../controllers/APIController')

const initAPIRoute = (app) => {
    router.get('/products', APIController.getAllProducts);
    router.post('/createProduct', APIController.createNewProduct)
    return app.use('/api/v1', router);
}

module.exports = initAPIRoute;