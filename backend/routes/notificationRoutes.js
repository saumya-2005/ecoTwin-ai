const express = require('express');
const Notification = require('../models/Notification');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    return res.json({ success: true, notification });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/notifications/read-all - Mark every unread notification as read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;