const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'Staff', 'Viewer'],
      default: 'Viewer',
    },
    organization: {
      type: String,
      default: 'EcoCampus University',
    },
    department: {
      type: String,
      default: 'Sustainability & Facilities Management',
    },
    avatar: {
      type: String,
      default: '',
    },
    preferences: {
      theme: { type: String, default: 'dark' },
      emailNotifications: { type: Boolean, default: true },
      anomalyAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
