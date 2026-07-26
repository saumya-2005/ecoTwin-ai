const express = require('express');
const { generateForecast } = require('../services/forecastEngine');
const Prediction = require('../models/Prediction');
const Building = require('../models/Building');

const router = express.Router();

// GET /api/predictions - Get or generate AI forecast for Electricity, Water, Waste, Carbon
router.get('/', async (req, res) => {
  try {
    const { metric = 'Electricity', timeframeDays = 30, buildingId } = req.query;

    const days = parseInt(timeframeDays, 10);
    const forecastData = generateForecast(metric, days);

    // Save prediction record for caching / analytics tracking
    const predictionDoc = new Prediction({
      buildingId: buildingId || undefined,
      metric,
      timeframeDays: days,
      forecast: forecastData.forecast,
      summaryStats: forecastData.summaryStats,
      modelUsed: forecastData.modelUsed,
    });

    await predictionDoc.save();

    return res.json({
      success: true,
      prediction: forecastData,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
