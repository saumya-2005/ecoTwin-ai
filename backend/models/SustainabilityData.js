const mongoose = require('mongoose');

const sustainabilityDataSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    electricityKwh: {
      type: Number,
      required: true,
      min: 0,
    },
    waterLiters: {
      type: Number,
      required: true,
      min: 0,
    },
    wasteKg: {
      type: Number,
      required: true,
      min: 0,
    },
    carbonKg: {
      type: Number,
      required: true,
      min: 0,
    },
    scope1Kg: {
      type: Number,
      default: 0,
    },
    scope2Kg: {
      type: Number,
      default: 0,
    },
    scope3Kg: {
      type: Number,
      default: 0,
    },
    solarGenerationKwh: {
      type: Number,
      default: 0,
    },
    occupancyCount: {
      type: Number,
      default: 0,
    },
    temperatureCelsius: {
      type: Number,
      default: 22.5,
    },
    isAnomaly: {
      type: Boolean,
      default: false,
    },
    anomalyReason: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['Sensor', 'CSV Upload', 'Excel Upload', 'Manual Entry'],
      default: 'Sensor',
    },
  },
  { timestamps: true }
);

sustainabilityDataSchema.index({ buildingId: 1, timestamp: -1 });

module.exports = mongoose.model('SustainabilityData', sustainabilityDataSchema);
