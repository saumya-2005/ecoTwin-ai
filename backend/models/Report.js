const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      enum: ['Executive Summary', 'Carbon Accounting', 'Energy Efficiency', 'Water & Waste Audit', 'Custom'],
      default: 'Executive Summary',
    },
    dateRange: {
      startDate: { type: String },
      endDate: { type: String },
    },
    buildingsIncluded: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
      },
    ],
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    summaryMetrics: {
      totalElectricityKwh: { type: Number },
      totalWaterLiters: { type: Number },
      totalCarbonKg: { type: Number },
      sustainabilityScoreAvg: { type: Number },
    },
    executiveSummary: {
      type: String,
    },
    recommendations: [
      { type: String }
    ],
    fileUrl: {
      type: String,
      default: '',
    },
    fileSizeBytes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);