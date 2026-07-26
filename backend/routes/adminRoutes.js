const express = require('express');
const User = require('../models/User');
const Building = require('../models/Building');
const SustainabilityData = require('../models/SustainabilityData');
const Report = require('../models/Report');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/users - User Management (Admin only)
router.get('/users', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id/role - Update user role (Admin only)
router.put('/users/:id/role', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Admin', 'Staff', 'Viewer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    return res.json({ success: true, message: 'User role updated.', user: updatedUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/stats - System health & telemetry stats (Admin only)
router.get('/stats', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuildings = await Building.countDocuments();
    const totalRecords = await SustainabilityData.countDocuments();
    const totalReports = await Report.countDocuments();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalBuildings,
        totalRecords,
        totalReports,
        aiServiceStatus: 'Operational (Gemini 2.5 Flash & Prophet Ensemble)',
        dbStatus: 'Connected',
        uptimeSeconds: process.uptime(),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
