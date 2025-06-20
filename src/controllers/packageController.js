const packageModel = require('../models/packageModel');

/**
 * POST /api/packages/search
 * Body JSON: { destination?, durationDays?, minPrice?, maxPrice?, travelers? }
 */
const searchPackages = async (req, res) => {
  try {
    const { destination, durationDays, minPrice, maxPrice, travelers } = req.body;
    // Parse numeric fields if present
    const filters = {
      destination,
      durationDays: durationDays !== undefined ? parseInt(durationDays) : undefined,
      minPrice: minPrice !== undefined ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? parseInt(maxPrice) : undefined,
      travelers: travelers !== undefined ? parseInt(travelers) : undefined
    };
    const pkgs = await packageModel.searchPackages(filters);
    return res.json({ success: true, packages: pkgs });
  } catch (err) {
    console.error('Error in searchPackages:', err);
    return res.status(500).json({ success: false, message: 'Error searching packages', error: err.message });
  }
};

/**
 * GET /api/packages/:id
 */
const getPackageDetails = async (req, res) => {
  try {
    const pkg = await packageModel.getPackageById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    return res.json({ success: true, package: pkg });
  } catch (err) {
    console.error('Error in getPackageDetails:', err);
    return res.status(500).json({ success: false, message: 'Error fetching package details', error: err.message });
  }
};

/**
 * POST /api/packages/book
 * Protected: requires auth middleware; uses req.user.id
 * Body JSON:
 * {
 *   "packageId": 1,
 *   "travelDate": "2024-08-01",
 *   "travelers": 2
 * }
 */
const bookPackage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { packageId, travelDate, travelers } = req.body;
    if (!packageId || !travelDate || travelers === undefined) {
      return res.status(400).json({ success: false, message: 'Missing fields: packageId, travelDate, travelers required' });
    }
    // Optionally: validate travelDate format, future date, etc.
    const { bookingId, bookingReference, totalCost } = await packageModel.createPackageBooking({
      userId,
      packageId: parseInt(packageId),
      travelDate,
      travelers: parseInt(travelers)
    });
    return res.status(201).json({
      success: true,
      bookingId,
      bookingReference,
      totalCost
    });
  } catch (err) {
    console.error('Error in bookPackage:', err);
    return res.status(500).json({ success: false, message: 'Error booking package', error: err.message });
  }
};

module.exports = {
  searchPackages,
  getPackageDetails,
  bookPackage
};
