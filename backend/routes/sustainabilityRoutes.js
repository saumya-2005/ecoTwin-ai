const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const csvParser = require('csv-parser');
const fs = require('fs');
const SustainabilityData = require('../models/SustainabilityData');
const Building = require('../models/Building');
const Notification = require('../models/Notification');
const { detectAnomaliesInReadings } = require('../services/forecastEngine');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


// ---- Helper: normalize row keys (trim, strip BOM, lowercase) then match variants ----
function normalizeRow(row) {
  const map = {};
  for (const key in row) {
    const cleanKey = key.replace(/^\uFEFF/, '').trim().toLowerCase();
    map[cleanKey] = row[key];
  }
  return map;
}

function extractFields(row) {
  const norm = normalizeRow(row);

  const elec =
    norm['electricity'] ?? norm['electricitykwh'] ?? norm['kwh'] ?? norm['electricity (kwh)'];
  const water =
    norm['water'] ?? norm['waterliters'] ?? norm['liters'] ?? norm['water (l)'] ?? norm['water (liters)'];
  const waste =
    norm['waste'] ?? norm['wastekg'] ?? norm['kg'] ?? norm['waste (kg)'];
  const building =
    norm['building'] ?? norm['buildingname'] ?? norm['building name'] ?? norm['code'];
  const date = norm['date'];
  const carbon = norm['carbon'] ?? norm['carbonkg'];

  return { elec, water, waste, building, date, carbon };
}


// GET /api/sustainability/dashboard - Dashboard KPI Totals & Chart Telemetry directly from MongoDB
router.get('/dashboard', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30;

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const aggregateTotals = await SustainabilityData.aggregate([
      { $match: { timestamp: { $gte: sinceDate } } },
      {
        $group: {
          _id: null,
          totalElectricity: { $sum: '$electricityKwh' },
          totalWater: { $sum: '$waterLiters' },
          totalWaste: { $sum: '$wasteKg' },
          totalCarbon: { $sum: '$carbonKg' },
          totalSolar: { $sum: '$solarGenerationKwh' },
          totalScope1: { $sum: '$scope1Kg' },
          totalScope2: { $sum: '$scope2Kg' },
          totalScope3: { $sum: '$scope3Kg' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totals = aggregateTotals[0] || {
      totalElectricity: 0,
      totalWater: 0,
      totalWaste: 0,
      totalCarbon: 0,
      totalSolar: 0,
      totalScope1: 0,
      totalScope2: 0,
      totalScope3: 0,
      count: 0,
    };

    const buildings = await Building.find();
    const avgScore = buildings.length
      ? Math.round(buildings.reduce((acc, b) => acc + (b.sustainabilityScore || 85), 0) / buildings.length)
      : 85;

    const timeSeriesData = await SustainabilityData.aggregate([
      { $match: { timestamp: { $gte: sinceDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          electricity: { $sum: '$electricityKwh' },
          water: { $sum: '$waterLiters' },
          waste: { $sum: '$wasteKg' },
          carbon: { $sum: '$carbonKg' },
          solar: { $sum: '$solarGenerationKwh' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const chartData = timeSeriesData.map((item) => {
      const dateObj = new Date(item._id);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: dayName || item._id,
        fullDate: item._id,
        electricity: item.electricity,
        water: item.water,
        waste: item.waste,
        carbon: item.carbon,
        solar: item.solar,
      };
    });

    const recentAnomalies = await SustainabilityData.find({ isAnomaly: true })
      .populate('buildingId', 'name code')
      .sort({ timestamp: -1 })
      .limit(5);

    return res.json({
      success: true,
      totals: {
        totalElectricity: totals.totalElectricity,
        totalWater: totals.totalWater,
        totalWaste: totals.totalWaste,
        totalCarbonKg: totals.totalCarbon,
        totalCarbonTons: Number((totals.totalCarbon / 1000).toFixed(1)),
        totalSolar: totals.totalSolar,
        sustainabilityScore: avgScore,
        scope1: totals.totalScope1,
        scope2: totals.totalScope2,
        scope3: totals.totalScope3,
      },
      chartData,
      buildings,
      recentAnomalies,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sustainability - Aggregated metrics & raw record listing
router.get('/', async (req, res) => {
  try {
    const { buildingId, timeframe = '30d' } = req.query;

    const query = {};
    if (buildingId) query.buildingId = buildingId;

    const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    query.timestamp = { $gte: sinceDate };

    const records = await SustainabilityData.find(query)
      .populate('buildingId', 'name code category status sustainabilityScore')
      .sort({ timestamp: 1 });

    const totals = records.reduce(
      (acc, curr) => {
        acc.electricity += curr.electricityKwh || 0;
        acc.water += curr.waterLiters || 0;
        acc.waste += curr.wasteKg || 0;
        acc.carbon += curr.carbonKg || 0;
        acc.solar += curr.solarGenerationKwh || 0;
        acc.scope1 += curr.scope1Kg || 0;
        acc.scope2 += curr.scope2Kg || 0;
        acc.scope3 += curr.scope3Kg || 0;
        return acc;
      },
      { electricity: 0, water: 0, waste: 0, carbon: 0, solar: 0, scope1: 0, scope2: 0, scope3: 0 }
    );

    return res.json({
      success: true,
      timeframe,
      totals,
      recordCount: records.length,
      data: records,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sustainability/manual - Single entry insertion
router.post('/manual', async (req, res) => {
  try {
    const { buildingId, electricityKwh, waterLiters, wasteKg, carbonKg, scope1Kg, scope2Kg, scope3Kg, solarGenerationKwh } = req.body;

    let targetBuildingId = buildingId;
    if (!targetBuildingId) {
      const defaultBuilding = await Building.findOne();
      if (defaultBuilding) targetBuildingId = defaultBuilding._id;
    }

    if (!targetBuildingId) {
      return res.status(400).json({ success: false, message: 'No building available. Add a building first.' });
    }

    const calculatedCarbon = Number(carbonKg) || Number((electricityKwh * 0.42 + waterLiters * 0.001 + wasteKg * 0.8).toFixed(1));
    const checked = detectAnomaliesInReadings([{ electricityKwh, waterLiters, carbonKg: calculatedCarbon }])[0];

    const record = new SustainabilityData({
      buildingId: targetBuildingId,
      electricityKwh: Number(electricityKwh) || 0,
      waterLiters: Number(waterLiters) || 0,
      wasteKg: Number(wasteKg) || 0,
      carbonKg: calculatedCarbon,
      scope1Kg: Number(scope1Kg) || Number((calculatedCarbon * 0.18).toFixed(1)),
      scope2Kg: Number(scope2Kg) || Number((electricityKwh * 0.42).toFixed(1)),
      scope3Kg: Number(scope3Kg) || Number((wasteKg * 0.8).toFixed(1)),
      solarGenerationKwh: Number(solarGenerationKwh) || 0,
      isAnomaly: checked.isAnomaly,
      anomalyReason: checked.anomalyReason,
      source: 'Manual Entry',
    });

    await record.save();

    return res.status(201).json({ success: true, message: 'Sustainability data point created in MongoDB.', record });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sustainability/upload - CSV / Excel file parsing & MongoDB persistence
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const isExcel = originalName.endsWith('.xlsx') || originalName.endsWith('.xls');

    // Load real buildings and build a name/code -> id lookup map
    const allBuildings = await Building.find();
    if (allBuildings.length === 0) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No buildings exist yet. Add a building in Buildings Management before uploading data.',
      });
    }

    const buildingMap = {};
    allBuildings.forEach((b) => {
      buildingMap[b.name.trim().toLowerCase()] = b._id;
      buildingMap[b.code.trim().toLowerCase()] = b._id;
    });
    // 🔧 THIS was the missing line causing "defaultBuildingId is not defined"
    const defaultBuildingId = allBuildings[0]._id;

    const parsedRows = [];

    if (isExcel) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(sheet);

      json.forEach((row, i) => {
        const elec = row.Electricity ?? row.electricityKwh ?? row.ElectricityKwh ?? row.kWh;
        const water = row.Water ?? row.waterLiters ?? row.WaterLiters ?? row.Liters;
        const waste = row.Waste ?? row.wasteKg ?? row.WasteKg ?? row.Kg;

        if (elec === undefined || water === undefined || waste === undefined) {
          throw new Error(`Row ${i + 2}: required column missing (Electricity/Water/Waste). Check your file headers.`);
        }

        parsedRows.push({
          building: row.Building || row.building || row.BuildingName || null,
          date: row.Date || row.date || null,
          electricityKwh: Number(elec),
          waterLiters: Number(water),
          wasteKg: Number(waste),
          carbonKg: row.Carbon !== undefined ? Number(row.Carbon) : null,
        });
      });
    } else {
      // CSV branch - now matches Excel branch: real validation, no fake fallback numbers
      let rowIndex = 1;
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row) => {
            rowIndex += 1;
            const elec = row.Electricity ?? row.electricityKwh ?? row.ElectricityKwh ?? row.kWh;
            const water = row.Water ?? row.waterLiters ?? row.WaterLiters ?? row.Liters;
            const waste = row.Waste ?? row.wasteKg ?? row.WasteKg ?? row.Kg;

            if (elec === undefined || water === undefined || waste === undefined) {
              reject(new Error(`Row ${rowIndex}: required column missing (Electricity/Water/Waste). Check your file headers.`));
              return;
            }

            parsedRows.push({
              building: row.Building || row.building || row.BuildingName || null,
              date: row.Date || row.date || null,
              electricityKwh: Number(elec),
              waterLiters: Number(water),
              wasteKg: Number(waste),
              carbonKg: row.Carbon !== undefined ? Number(row.Carbon) : null,
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (parsedRows.length === 0) {
      return res.status(400).json({ success: false, message: 'File contained no readable rows.' });
    }

    const checkedRows = detectAnomaliesInReadings(parsedRows);

    const documentsToInsert = checkedRows.map((r) => {
      const calculatedCarbon =
        r.carbonKg ?? Number((r.electricityKwh * 0.42 + r.waterLiters * 0.001 + r.wasteKg * 0.8).toFixed(1));

      const matchedBuildingId = r.building
        ? buildingMap[r.building.trim().toLowerCase()] || defaultBuildingId
        : defaultBuildingId;

      const realTimestamp = r.date ? new Date(r.date) : new Date();

      return {
        buildingId: matchedBuildingId,
        timestamp: isNaN(realTimestamp.getTime()) ? new Date() : realTimestamp,
        electricityKwh: r.electricityKwh,
        waterLiters: r.waterLiters,
        wasteKg: r.wasteKg,
        carbonKg: calculatedCarbon,
        scope1Kg: Number((calculatedCarbon * 0.18).toFixed(1)),
        scope2Kg: Number((r.electricityKwh * 0.42).toFixed(1)),
        scope3Kg: Number((r.wasteKg * 0.8).toFixed(1)),
        isAnomaly: r.isAnomaly,
        anomalyReason: r.anomalyReason,
        source: isExcel ? 'Excel Upload' : 'CSV Upload',
      };
    });

    await SustainabilityData.insertMany(documentsToInsert);

    const anomaliesCount = documentsToInsert.filter((d) => d.isAnomaly).length;
    if (anomaliesCount > 0) {
      await Notification.create({
        title: 'New Upload Anomaly Flag',
        message: `File upload (${originalName}) detected ${anomaliesCount} consumption anomaly entries in MongoDB.`,
        type: 'electricity_spike',
        severity: 'warning',
      });
    }

    return res.json({
      success: true,
      message: `Successfully saved ${documentsToInsert.length} telemetry entries into MongoDB.`,
      insertedCount: documentsToInsert.length,
      sample: documentsToInsert.slice(0, 5),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;