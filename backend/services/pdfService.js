const PDFDocument = require('pdfkit');

/**
 * Build professional EcoTwin AI Sustainability PDF Report Buffer
 */
const generatePDFReportBuffer = (reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Primary Palette
      const emeraldColor = '#059669';
      const darkSlate = '#0f172a';
      const lightGray = '#f8fafc';

      // Header Banner
      doc.rect(0, 0, 595.28, 100).fill(darkSlate);
      doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('ECOTWIN AI', 40, 30);
      doc.fillColor(emeraldColor).fontSize(10).font('Helvetica').text('SUSTAINABILITY INTELLIGENCE PLATFORM', 40, 56);

      doc.fillColor('#94a3b8').fontSize(9).text(`Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, 380, 40, { align: 'right' });
      doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text(reportData.title || 'Campus Sustainability Performance Audit', 380, 56, { align: 'right' });

      // Title & Subtitle
      doc.moveDown(4);
      doc.fillColor(darkSlate).fontSize(16).font('Helvetica-Bold').text('1. Executive Overview', 40, 120);

      doc.fillColor('#334155').fontSize(10).font('Helvetica').text(
        reportData.executiveSummary ||
          'This executive intelligence report synthesizes real-time sensor metrics, building energy baselines, and carbon footprint telemetry across campus facilities. AI analysis identifies operational efficiencies and targeted carbon reduction opportunities.',
        40,
        142,
        { width: 515, lineGap: 4 }
      );

      // KPI Metric Cards Box
      doc.rect(40, 200, 515, 80).fill(lightGray).stroke('#e2e8f0');

      const kpis = [
        { label: 'Total Electricity', val: `${(reportData.totalElectricityKwh || 185400).toLocaleString()} kWh` },
        { label: 'Water Consumed', val: `${(reportData.totalWaterLiters || 492000).toLocaleString()} L` },
        { label: 'Net CO2e Emissions', val: `${((reportData.totalCarbonKg || 78400) / 1000).toFixed(1)} Metric Tons` },
        { label: 'Sustainability Index', val: `${reportData.sustainabilityScoreAvg || 86}/100` },
      ];

      kpis.forEach((kpi, idx) => {
        const xOffset = 50 + idx * 125;
        doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text(kpi.label.toUpperCase(), xOffset, 215);
        doc.fillColor(emeraldColor).fontSize(13).font('Helvetica-Bold').text(kpi.val, xOffset, 235);
      });

      // Section 2: Key AI Recommendations
      doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('2. AI-Driven Action Plan & Optimization Tips', 40, 305);

      const recommendations = reportData.recommendations || [
        'Shift Science Complex thermal cooling schedules by -2°C between 00:00 - 05:00 to reduce base load draw.',
        'Expand roof-mounted photovoltaic array on Innovation Tower to achieve 30% solar grid independence.',
        'Address secondary water loop pressure fluctuations in Engineering Hall to eliminate ~450L/day idle loss.',
        'Implement smart waste segregation sensors to improve recycling conversion efficiency to >65%.',
      ];

      let currentY = 330;
      recommendations.forEach((rec, i) => {
        doc.rect(40, currentY, 6, 24).fill(emeraldColor);
        doc.fillColor('#1e293b').fontSize(9.5).font('Helvetica').text(`${i + 1}. ${rec}`, 54, currentY + 4, { width: 490 });
        currentY += 34;
      });

      // Section 3: Building Breakdown Table
      doc.fillColor(darkSlate).fontSize(14).font('Helvetica-Bold').text('3. Facility Telemetry & Efficiency Matrix', 40, currentY + 10);
      currentY += 35;

      // Table Header
      doc.rect(40, currentY, 515, 22).fill('#1e293b');
      doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold');
      doc.text('BUILDING NAME', 50, currentY + 6);
      doc.text('CODE', 180, currentY + 6);
      doc.text('AREA (SQFT)', 250, currentY + 6);
      doc.text('STATUS', 350, currentY + 6);
      doc.text('SCORE', 460, currentY + 6, { align: 'right' });

      currentY += 22;

      const sampleBuildings = reportData.buildings || [
        { name: 'Science & Innovation Complex', code: 'SIC-01', areaSqFt: 120000, status: 'Green', score: 88 },
        { name: 'Engineering Hall', code: 'ENG-02', areaSqFt: 95000, status: 'Yellow', score: 74 },
        { name: 'Innovation Tower', code: 'IT-03', areaSqFt: 140000, status: 'Green', score: 92 },
        { name: 'Student Union Center', code: 'SUC-04', areaSqFt: 65000, status: 'Green', score: 85 },
        { name: 'Central Research Library', code: 'CRL-05', areaSqFt: 80000, status: 'Green', score: 89 },
      ];

      sampleBuildings.forEach((b, idx) => {
        const rowBg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        doc.rect(40, currentY, 515, 20).fill(rowBg);
        doc.fillColor('#334155').fontSize(8.5).font('Helvetica');
        doc.text(b.name, 50, currentY + 5);
        doc.text(b.code, 180, currentY + 5);
        doc.text(b.areaSqFt.toLocaleString(), 250, currentY + 5);

        const statusColor = b.status === 'Green' ? '#059669' : b.status === 'Yellow' ? '#d97706' : '#dc2626';
        doc.fillColor(statusColor).font('Helvetica-Bold').text(b.status, 350, currentY + 5);
        doc.fillColor('#0f172a').font('Helvetica-Bold').text(`${b.score}/100`, 460, currentY + 5, { align: 'right' });

        currentY += 20;
      });

      // Footer Signature Box
      doc.rect(40, 750, 515, 40).fill(lightGray);
      doc.fillColor('#64748b').fontSize(8).font('Helvetica').text('Certified by EcoTwin AI Engine | Automated Sustainability Compliance Standard ISO 50001', 50, 765);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generatePDFReportBuffer };
