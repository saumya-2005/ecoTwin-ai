const express = require('express');
const Building = require('../models/Building');
const SustainabilityData = require('../models/SustainabilityData');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /api/buildings - List all buildings with current summary metrics
router.get('/', async (req, res) => {
  try {
    const buildings = await Building.find().sort({ sustainabilityScore: -1 });
    return res.json({ success: true, count: buildings.length, data: buildings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/buildings/:id - Detail view
router.get('/:id', async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ success: false, message: 'Building not found.' });
    }

    // Fetch latest 30 days telemetry
    const telemetry = await SustainabilityData.find({ buildingId: building._id })
      .sort({ timestamp: -1 })
      .limit(30);

    return res.json({
      success: true,
      building,
      recentTelemetry: telemetry.reverse(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/buildings - Create new building (Admin/Staff)
router.post('/', verifyToken, authorizeRoles('Admin', 'Staff'), async (req, res) => {
  try {
    const newBuilding = new Building(req.body);
    await newBuilding.save();
    return res.status(201).json({ success: true, message: 'Building registered successfully.', building: newBuilding });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/buildings/:id - Update building (Admin/Staff)
router.put('/:id', verifyToken, authorizeRoles('Admin', 'Staff'), async (req, res) => {
  try {
    const updated = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Building not found.' });
    return res.json({ success: true, message: 'Building updated.', building: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/buildings/:id - Delete building (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    await Building.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Building removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
