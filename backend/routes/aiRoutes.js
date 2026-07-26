const express = require('express');
const { generateSustainabilityInsight, handleChatBotQuery } = require('../services/geminiService');
const Building = require('../models/Building');
const SustainabilityData = require('../models/SustainabilityData');
const ChatHistory = require('../models/ChatHistory');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/ai/insights - Generate Gemini analysis on campus or building data
router.post('/insights', async (req, res) => {
  try {
    const { buildingId } = req.body;

    const buildings = await Building.find().limit(5);
    const recentTelemetry = await SustainabilityData.find().sort({ timestamp: -1 }).limit(30);

    const totalKwh = recentTelemetry.reduce((acc, r) => acc + r.electricityKwh, 0);
    const totalWater = recentTelemetry.reduce((acc, r) => acc + r.waterLiters, 0);
    const totalCarbon = recentTelemetry.reduce((acc, r) => acc + r.carbonKg, 0);
    const avgScore = Math.round(buildings.reduce((acc, b) => acc + b.sustainabilityScore, 0) / (buildings.length || 1));

    const dataContext = {
      avgScore,
      totalKwh,
      totalWater,
      totalCarbon,
      buildingCount: buildings.length,
      anomalies: recentTelemetry.filter((r) => r.isAnomaly).map((r) => r.anomalyReason),
    };

    const insightText = await generateSustainabilityInsight(dataContext);
    let parsedInsight;
    try {
      parsedInsight = typeof insightText === 'string' && insightText.trim().startsWith('{') ? JSON.parse(insightText) : null;
    } catch (e) {
      parsedInsight = null;
    }

    return res.json({
      success: true,
      dataContext,
      insight: parsedInsight || { rawText: insightText },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/chat - EcoTwin Copilot RAG assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId = 'default-session', userId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message prompt is required.' });
    }

    const buildings = await Building.find();
    const recentMetrics = await SustainabilityData.find().sort({ timestamp: -1 }).limit(10);

    const contextData = {
      buildings: buildings.map((b) => ({
        name: b.name,
        code: b.code,
        sustainabilityScore: b.sustainabilityScore,
        status: b.status,
      })),
      recentMetricsSummary: recentMetrics.map((m) => ({
        electricityKwh: m.electricityKwh,
        waterLiters: m.waterLiters,
        carbonKg: m.carbonKg,
        isAnomaly: m.isAnomaly,
      })),
    };

    const botResult = await handleChatBotQuery(message, [], contextData);

    // Optionally save to ChatHistory if userId is available
    if (userId) {
      await ChatHistory.create([
        { userId, conversationId, role: 'user', content: message },
        { userId, conversationId, role: 'assistant', content: botResult.text, sources: botResult.sources },
      ]);
    }

    return res.json({
      success: true,
      reply: botResult.text,
      sources: botResult.sources,
      conversationId,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
