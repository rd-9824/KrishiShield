import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import CropRecommendation from '../models/cropRecommendation.js';
import DiseaseResult from '../models/diseaseResult.js';
import { translateText } from "../services/translate.js";
import {
  buildTreatmentsForDisease,
  financialImpactFromSeverity,
  hfClassifyImage,
  levelFromSeverity,
  severityFromScore,
  yieldLossFromSeverity,
} from '../services/hfDiseaseDetection.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// simple auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// crop analysis
router.post('/analyze-crop', auth, async (req, res) => {
  try {
    const { nitrogen = 0, phosphorus = 0, potassium = 0, ph = 7, rainfall = 0 } = req.body;
    // dummy logic: pick a crop based on nitrogen value
    const crops = ['Maize', 'Soybean', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Sugarcane', 'Chickpea'];
    const idx = Math.floor((nitrogen / 200) * crops.length) % crops.length;
    const recommendations = [
      { name: crops[idx], confidence: 87, risk: 'low', roi: '₹28,000–₹35,000' },
      { name: crops[(idx + 1) % crops.length], confidence: 74, risk: 'medium', roi: '₹22,000–₹29,000' },
      { name: crops[(idx + 2) % crops.length], confidence: 61, risk: 'high', roi: '₹38,000–₹50,000' }
    ];
    const result = {
      recommendations,
      riskScore: 42,
      rainfallDeviation: '+12%',
      insight: 'Based on provided parameters, the top crop is optimal for this season.'
    };
    // save
    await CropRecommendation.create({
      userId: req.user.id,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      rainfall,
      result
    });
    const lang = req.query.lang || "en";

if (lang !== "en") {
  result.insight = await translateText(result.insight, lang);
}

res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// disease detection - accepts image file and crop name
router.post('/detect-disease', auth, upload.single('image'), async (req, res) => {
  try {
    const crop = req.body.crop || 'Unknown';

    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'Missing image file (field name: image)' });
    }

    const modelId = process.env.HF_MODEL_ID;
    const token = process.env.HF_API_TOKEN;

    const pred = await hfClassifyImage({
      modelId,
      token,
      imageBuffer: req.file.buffer,
    });

    const confidence = Math.round((pred.score || 0) * 100);
    const severity = severityFromScore(pred.score);
    const level = levelFromSeverity(severity);

    const result = {
      crop,
      name: pred.label,
      confidence,
      severity,
      level,
      yieldLoss: yieldLossFromSeverity(severity),
      financialImpact: financialImpactFromSeverity(severity),
      treatments: buildTreatmentsForDisease(pred.label),
      model: modelId,
    };

    await DiseaseResult.create({
      userId: req.user.id,
      crop,
      result,
      imageUrl: req.body.imageUrl || '',
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err?.message || String(err) });
  }
});

// the real weather endpoints live in /routes/weather.js
// this route used to return static data and has been removed.

// yield estimation
router.post('/yield', auth, (req, res) => {
  const { crop = 'Maize', area = 1, severity = 0, price = 0 } = req.body;
  // reuse same constants as front-end so results match
  const CROPS = {
    Maize:     { sens: 0.65, base: 55,  price: 1850 },
    Wheat:     { sens: 0.55, base: 45,  price: 2200 },
    Rice:      { sens: 0.70, base: 65,  price: 1950 },
    Soybean:   { sens: 0.60, base: 30,  price: 3800 },
    Cotton:    { sens: 0.75, base: 20,  price: 6500 },
    Sugarcane: { sens: 0.50, base: 400, price: 285  },
    Chickpea:  { sens: 0.55, base: 18,  price: 4800 },
    Groundnut: { sens: 0.60, base: 25,  price: 5200 },
  };
  const cfg = CROPS[crop] || CROPS.Maize;
  const base = cfg.base * area;
  const lp = severity * cfg.sens / 100;
  const actual = +(base * (1 - lp)).toFixed(1);
  const lossQ = +(base - actual).toFixed(1);
  const lossR = Math.round(lossQ * (price || cfg.price) / 10);
  const rev = Math.round(actual * (price || cfg.price) / 10);
  res.json({ crop, area, base, actual, lossQ, lossR, rev, lp: Math.round(lp * 1000) / 10 });
});

// profit report - dynamic based on user's latest results
router.get('/profit-report', auth, async (req, res) => {
  try {
    // reuse same constants as /yield so reports match
    const CROPS = {
      Maize:     { sens: 0.65, base: 55,  price: 1850, costPerAcre: 12000 },
      Wheat:     { sens: 0.55, base: 45,  price: 2200, costPerAcre: 15000 },
      Rice:      { sens: 0.70, base: 65,  price: 1950, costPerAcre: 18000 },
      Soybean:   { sens: 0.60, base: 30,  price: 3800, costPerAcre: 11000 },
      Cotton:    { sens: 0.75, base: 20,  price: 6500, costPerAcre: 22000 },
      Sugarcane: { sens: 0.50, base: 400, price: 285,  costPerAcre: 30000 },
      Chickpea:  { sens: 0.55, base: 18,  price: 4800, costPerAcre: 9000 },
      Groundnut: { sens: 0.60, base: 25,  price: 5200, costPerAcre: 14000 },
    };

    const latestRec = await CropRecommendation.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    const latestDisease = await DiseaseResult.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    const severity = Number(latestDisease?.result?.severity) || 0;

    // parse area from onboarding / user history; fallback to 1 acre
    const rawArea = Number(latestRec?.farmSize) || Number(latestRec?.landSize) || 0;
    const area = rawArea > 0 ? rawArea : 1;

    // pick up to 3 crops from the latest recommendation, otherwise default list
    const recCrops = latestRec?.result?.recommendations?.map((r) => r?.name).filter(Boolean) || [];
    const picks = Array.from(new Set(recCrops)).slice(0, 3);
    const cropList = picks.length ? picks : ['Maize', 'Wheat', 'Rice'];

    const rows = cropList.map((crop) => {
      const cfg = CROPS[crop] || CROPS.Maize;
      const base = cfg.base * area; // quintals
      const lp = severity * cfg.sens / 100;
      const actual = +(base * (1 - lp)).toFixed(1);
      const revenue = Math.round(actual * cfg.price / 10); // ₹ (same convention as /yield)
      const cost = Math.round(cfg.costPerAcre * area);
      const profit = revenue - cost;
      return { crop, revenue, cost, profit, expectedYield: base, actualYield: actual, lossPct: Math.round(lp * 1000) / 10 };
    });

    const top = rows.slice().sort((a, b) => b.profit - a.profit)[0] || rows[0];
    const monthProfit = top?.profit || 0;
    const annual = monthProfit * 12;
    const perAcre = Math.round(monthProfit / area);

    const summary = [
      { key: 'thisMonthProfit', value: monthProfit, deltaPct: null },
      { key: 'estimatedAnnual', value: annual, deltaPct: null },
      { key: 'averagePerAcre', value: perAcre, deltaPct: null },
    ];

    res.json({ summary, rows, meta: { area, severity } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// simple simulator sample - compute same metrics as front-end
router.post('/simulate', auth, (req, res) => {
  const { rain = 210, price = 1850, sev = 22, tempDev = 2 } = req.body;
  function calcRisk(rain, price, sev, tempDev) {
    let score = 0;
    if (rain < 100 || rain > 400) score += 2; else if (rain < 150 || rain > 300) score += 1;
    if (sev > 30) score += 2; else if (sev > 15) score += 1;
    if (Math.abs(tempDev) > 5) score += 2; else if (Math.abs(tempDev) > 2) score += 1;
    if (price < 1000) score += 1;
    return score;
  }
  const riskScore = calcRisk(rain, price, sev, tempDev);
  const riskLabel = riskScore >= 5 ? 'high' : riskScore >= 3 ? 'medium' : 'low';
  const yieldLoss = Math.round(sev * 0.65 + Math.abs(tempDev) * 0.5);
  const yieldAmt  = +(55 * (1 - yieldLoss / 100)).toFixed(1);
  const profit    = Math.round(yieldAmt * 10 * price / 1000);
  const irrLevel  = rain < 150 ? 'high' : rain < 250 ? 'medium' : 'low';
  const fertAdj   = tempDev > 3 ? 'plus10N' : tempDev > 0 ? 'plus5N' : 'normal';
  res.json({ riskScore, riskLabel, yieldLoss, yieldAmt, profit, irrLevel, fertAdj });
});

//onboarding questin saving
router.post('/onboarding', auth, async (req, res) => {
  try {
    const { landType, state, requirement, farmSize } = req.body;

    console.log("Incoming onboarding data:", req.body);

    const record = await CropRecommendation.create({
      userId: req.user.id,
      landType,
      state,
      requirement,
      farmSize
    });

    res.json({
      message: "Onboarding data saved",
      record
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
