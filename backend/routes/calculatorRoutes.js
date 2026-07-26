const express = require('express');

const router = express.Router();

// POST /api/calculator/calculate
router.post('/calculate', (req, res) => {
  try {
    const {
      electricityKwh = 0,
      naturalGasTherms = 0,
      dieselLiters = 0,
      wasteKg = 0,
      airTravelKm = 0,
      carTravelKm = 0,
    } = req.body;

    // GHG Protocol Emission Factors
    // Scope 1: Direct emissions (Gas & Fuel)
    const scope1 = naturalGasTherms * 5.3 + dieselLiters * 2.68;

    // Scope 2: Indirect emissions (Grid Electricity - 0.42 kg CO2e / kWh)
    const scope2 = electricityKwh * 0.42;

    // Scope 3: Value chain emissions (Waste & Travel)
    const scope3 = wasteKg * 0.82 + airTravelKm * 0.15 + carTravelKm * 0.19;

    const totalCarbonKg = scope1 + scope2 + scope3;
    const totalCarbonMetricTons = totalCarbonKg / 1000;

    // Tree Equivalence: 1 mature tree absorbs ~21.77 kg CO2 per year
    const equivalentTreesPlanted = Math.round(totalCarbonKg / 21.77);

    // Car passenger miles equivalent
    const equivalentCarMiles = Math.round(totalCarbonKg / 0.404);

    return res.json({
      success: true,
      result: {
        totalCarbonKg: Number(totalCarbonKg.toFixed(2)),
        totalCarbonMetricTons: Number(totalCarbonMetricTons.toFixed(3)),
        scopeBreakdown: {
          scope1: Number(scope1.toFixed(2)),
          scope2: Number(scope2.toFixed(2)),
          scope3: Number(scope3.toFixed(2)),
        },
        equivalencies: {
          treesNeeded: equivalentTreesPlanted,
          carMilesDriven: equivalentCarMiles,
        },
        rating:
          totalCarbonMetricTons < 5
            ? 'Low Carbon Impact (Exceptional)'
            : totalCarbonMetricTons < 25
            ? 'Moderate Impact (Optimizable)'
            : 'High Carbon Footprint (Immediate Action Required)',
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
