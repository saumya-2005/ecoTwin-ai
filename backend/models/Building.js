const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Research', 'Administrative', 'Residential', 'Sports & Facilities', 'Utility'],
      default: 'Academic',
    },
    areaSqFt: {
      type: Number,
      required: true,
    },
    occupantCapacity: {
      type: Number,
      default: 500,
    },
    floors: {
      type: Number,
      default: 4,
    },
    yearBuilt: {
      type: Number,
      default: 2018,
    },
    location: {
      latitude: { type: Number, default: 37.7749 },
      longitude: { type: Number, default: -122.4194 },
      zone: { type: String, default: 'North Campus' },
    },
    status: {
      type: String,
      enum: ['Green', 'Yellow', 'Red'],
      default: 'Green',
    },
    sustainabilityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    solarCapacityKw: {
      type: Number,
      default: 120,
    },
    hvacEfficiencyRating: {
      type: String,
      default: 'A+',
    },
    waterRecyclingAvailable: {
      type: Boolean,
      default: true,
    },
    baselineMonthlyElectricityKwh: {
      type: Number,
      default: 45000,
    },
    baselineMonthlyWaterLiters: {
      type: Number,
      default: 120000,
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Building', buildingSchema);
