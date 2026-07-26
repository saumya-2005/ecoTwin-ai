const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Building = require('./models/Building');
const SustainabilityData = require('./models/SustainabilityData');
const Notification = require('./models/Notification');
const Report = require('./models/Report');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecotwin_ai';

const seedDatabase = async () => {
  // 🔒 Safety gate — production mein kabhi nahi chalega
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ seed.js production mein chalane ki permission nahi hai.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB for database seed...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clear existing data
    await User.deleteMany({});
    await Building.deleteMany({});
    await SustainabilityData.deleteMany({});
    await Notification.deleteMany({});
    await Report.deleteMany({});

    console.log('Cleared existing collections.');

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const staffPassword = await bcrypt.hash('staff123', salt);
    const viewerPassword = await bcrypt.hash('viewer123', salt);

    const users = await User.create([
      {
        name: 'Dr. Elena Rostova',
        email: 'admin@ecotwin.ai',
        password: adminPassword,
        role: 'Admin',
        organization: 'EcoCampus Global University',
        department: 'Sustainability & AI Governance',
      },
      {
        name: 'Marcus Vance',
        email: 'staff@ecotwin.ai',
        password: staffPassword,
        role: 'Staff',
        organization: 'EcoCampus Global University',
        department: 'Facilities & Energy Management',
      },
      {
        name: 'Sarah Chen',
        email: 'viewer@ecotwin.ai',
        password: viewerPassword,
        role: 'Viewer',
        organization: 'EcoCampus Global University',
        department: 'Environmental Science Student',
      },
    ]);
    console.log(`Created ${users.length} users (Admin, Staff, Viewer).`);

    // 2. Seed Buildings
    const buildingsData = [
      {
        name: 'Science & Innovation Complex',
        code: 'SIC-01',
        category: 'Research',
        areaSqFt: 125000,
        occupantCapacity: 1200,
        floors: 6,
        yearBuilt: 2021,
        location: { latitude: 37.7749, longitude: -122.4194, zone: 'North Campus Quad' },
        status: 'Green',
        sustainabilityScore: 92,
        solarCapacityKw: 180,
        hvacEfficiencyRating: 'A++',
        waterRecyclingAvailable: true,
        baselineMonthlyElectricityKwh: 58000,
        baselineMonthlyWaterLiters: 140000,
      },
      {
        name: 'Engineering Hall',
        code: 'ENG-02',
        category: 'Academic',
        areaSqFt: 98000,
        occupantCapacity: 950,
        floors: 5,
        yearBuilt: 2017,
        location: { latitude: 37.7755, longitude: -122.418, zone: 'Engineering Sector' },
        status: 'Yellow',
        sustainabilityScore: 76,
        solarCapacityKw: 90,
        hvacEfficiencyRating: 'B+',
        waterRecyclingAvailable: true,
        baselineMonthlyElectricityKwh: 48000,
        baselineMonthlyWaterLiters: 110000,
      },
      {
        name: 'Innovation Tower',
        code: 'IT-03',
        category: 'Administrative',
        areaSqFt: 145000,
        occupantCapacity: 1500,
        floors: 8,
        yearBuilt: 2023,
        location: { latitude: 37.7738, longitude: -122.421, zone: 'Tech Hub West' },
        status: 'Green',
        sustainabilityScore: 95,
        solarCapacityKw: 220,
        hvacEfficiencyRating: 'A++',
        waterRecyclingAvailable: true,
        baselineMonthlyElectricityKwh: 62000,
        baselineMonthlyWaterLiters: 160000,
      },
      {
        name: 'Student Union & Dining Hall',
        code: 'SUC-04',
        category: 'Residential',
        areaSqFt: 72000,
        occupantCapacity: 2000,
        floors: 3,
        yearBuilt: 2019,
        location: { latitude: 37.776, longitude: -122.42, zone: 'Central Plaza' },
        status: 'Green',
        sustainabilityScore: 84,
        solarCapacityKw: 60,
        hvacEfficiencyRating: 'A',
        waterRecyclingAvailable: false,
        baselineMonthlyElectricityKwh: 39000,
        baselineMonthlyWaterLiters: 190000,
      },
      {
        name: 'Central Research Library',
        code: 'CRL-05',
        category: 'Academic',
        areaSqFt: 85000,
        occupantCapacity: 800,
        floors: 4,
        yearBuilt: 2015,
        location: { latitude: 37.7742, longitude: -122.4175, zone: 'East Campus' },
        status: 'Green',
        sustainabilityScore: 89,
        solarCapacityKw: 110,
        hvacEfficiencyRating: 'A+',
        waterRecyclingAvailable: true,
        baselineMonthlyElectricityKwh: 34000,
        baselineMonthlyWaterLiters: 85000,
      },
    ];

    const buildings = await Building.create(buildingsData);
    console.log(`Created ${buildings.length} smart campus buildings.`);

    // 3. Seed 90 Days of Historical Telemetry per building
    const telemetryRecords = [];
    const now = new Date();

    for (let dayOffset = 90; dayOffset >= 0; dayOffset--) {
      const timestamp = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const isWeekend = timestamp.getDay() === 0 || timestamp.getDay() === 6;

      for (const building of buildings) {
        const factor = isWeekend ? 0.7 : 1.05;
        const randomVar = 0.95 + Math.random() * 0.1;

        let elec = Math.round((building.baselineMonthlyElectricityKwh / 30) * factor * randomVar);
        let water = Math.round((building.baselineMonthlyWaterLiters / 30) * factor * randomVar);
        let waste = Math.round(building.areaSqFt * 0.003 * factor * randomVar);

        let isAnomaly = false;
        let anomalyReason = '';

        if (dayOffset === 5 && building.code === 'ENG-02') {
          elec = Math.round(elec * 1.65);
          isAnomaly = true;
          anomalyReason = 'Abnormal HVAC chiller spike during off-peak hours (+65% higher draw)';
        }

        if (dayOffset === 18 && building.code === 'SUC-04') {
          water = Math.round(water * 2.1);
          isAnomaly = true;
          anomalyReason = 'Water flow anomaly detected in commercial kitchen dishwashing line';
        }

        const carbon = Math.round(elec * 0.42 + water * 0.001 + waste * 0.8);
        const scope1 = Math.round(carbon * 0.18);
        const scope2 = Math.round(elec * 0.42);
        const scope3 = Math.round(waste * 0.8 + water * 0.001);
        const solar = Math.round((building.solarCapacityKw * 4.8) * randomVar);

        telemetryRecords.push({
          buildingId: building._id,
          timestamp,
          electricityKwh: elec,
          waterLiters: water,
          wasteKg: waste,
          carbonKg: carbon,
          scope1Kg: scope1,
          scope2Kg: scope2,
          scope3Kg: scope3,
          solarGenerationKwh: solar,
          occupancyCount: Math.round(building.occupantCapacity * (isWeekend ? 0.2 : 0.85)),
          temperatureCelsius: Number((18 + Math.random() * 8).toFixed(1)),
          isAnomaly,
          anomalyReason,
          source: 'Sensor',
        });
      }
    }

    await SustainabilityData.insertMany(telemetryRecords);
    console.log(`Created ${telemetryRecords.length} high-resolution telemetry records.`);

    // 4. Seed Notifications
    await Notification.create([
      {
        buildingId: buildings[1]._id,
        title: 'Electricity Spike Alert',
        message: 'Engineering Hall (ENG-02) experienced a 65% power consumption spike at 02:15 AM.',
        type: 'electricity_spike',
        severity: 'critical',
        read: false,
      },
      {
        buildingId: buildings[3]._id,
        title: 'Water Leak Detected',
        message: 'Student Union & Dining Hall continuous flow alert. High probability of line leak.',
        type: 'water_leak',
        severity: 'warning',
        read: false,
      },
      {
        buildingId: buildings[2]._id,
        title: 'Solar Generation Peak',
        message: 'Innovation Tower achieved milestone 220 kW solar generation, offsetting 34% grid load.',
        type: 'system',
        severity: 'info',
        read: true,
      },
    ]);

    // 5. Seed Initial PDF Report Log
    await Report.create({
      title: 'Monthly Campus Carbon Footprint & Energy Audit',
      reportType: 'Executive Summary',
      dateRange: { startDate: '2026-06-01', endDate: '2026-06-30' },
      buildingsIncluded: buildings.map((b) => b._id),
      generatedBy: users[0]._id,
      summaryMetrics: {
        totalElectricityKwh: 184500,
        totalWaterLiters: 489000,
        totalCarbonKg: 78200,
        sustainabilityScoreAvg: 87,
      },
      executiveSummary: 'Campus operations achieved an overall 87/100 Sustainability Rating. Renewable solar generation offset 21% of total grid power draw.',
      recommendations: [
        'Optimize nocturnal laboratory ventilation in Science Complex.',
        'Install smart automatic shutoff valves on secondary water lines.',
      ],
    });

    console.log('\n=============================================');
    console.log(' DATABASE SEEDED SUCCESSFULLY!');
    console.log(' Demo Accounts Created:');
    console.log(' - Admin: admin@ecotwin.ai  | Password: admin123');
    console.log(' - Staff: staff@ecotwin.ai  | Password: staff123');
    console.log(' - Viewer: viewer@ecotwin.ai | Password: viewer123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Database seed error:', err);
    process.exit(1);
  }
};

seedDatabase();