const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController.js')

router.get('/', pageController.getHomepage);
router.get('/contact', pageController.getContact);

module.exports = router;