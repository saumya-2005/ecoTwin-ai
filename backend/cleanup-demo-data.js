const mongoose = require('mongoose');
require('dotenv').config();

const Building = require('./models/Building');
const SustainabilityData = require('./models/SustainabilityData');
const Notification = require('./models/Notification');
const Report = require('./models/Report');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecotwin_ai';

const cleanup = async () => {
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ Is script ko seedha production DB pe mat chalao bina backup ke. Aborting.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const buildingResult = await Building.deleteMany({});
        const telemetryResult = await SustainabilityData.deleteMany({});
        const notificationResult = await Notification.deleteMany({});
        const reportResult = await Report.deleteMany({});

        console.log('\n=============================================');
        console.log(' DEMO DATA CLEANED');
        console.log(` - Buildings removed: ${buildingResult.deletedCount}`);
        console.log(` - Telemetry records removed: ${telemetryResult.deletedCount}`);
        console.log(` - Notifications removed: ${notificationResult.deletedCount}`);
        console.log(` - Reports removed: ${reportResult.deletedCount}`);
        console.log(' Users (Admin/Staff/Viewer) ko touch nahi kiya gaya.');
        console.log('=============================================\n');

        process.exit(0);
    } catch (err) {
        console.error('Cleanup error:', err);
        process.exit(1);
    }
};

cleanup();