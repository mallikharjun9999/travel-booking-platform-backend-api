const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authenticateToken = require('../middleware/auth');

// Search packages via POST body
router.post('/search', packageController.searchPackages);

// Get package details
router.get('/:id', packageController.getPackageDetails);

// Book a package (auth required)
router.post('/book', authenticateToken, packageController.bookPackage);

module.exports = router;
