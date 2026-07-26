const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
    },
    metric: {
      type: String,
      enum: ['Electricity', 'Water', 'Waste', 'Carbon'],
      required: true,
    },
    timeframeDays: {
      type: Number,
      enum: [7, 30, 90],
      required: true,
    },
    forecast: [
      {
        date: { type: String, required: true },
        predictedValue: { type: Number, required: true },
        lowerBound: { type: Number },
        upperBound: { type: Number },
      },
    ],
    summaryStats: {
      expectedTotal: { type: Number },
      changePercentage: { type: Number },
      trend: { type: String, enum: ['Increasing', 'Decreasing', 'Stable'] },
    },
    modelUsed: {
      type: String,
      default: 'Prophet / Random Forest Hybrid',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', predictionSchema);
