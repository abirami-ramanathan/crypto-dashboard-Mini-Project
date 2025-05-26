const express = require('express');
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's portfolio
router.get('/', auth, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.userId });
    
    // If portfolio doesn't exist, create one
    if (!portfolio) {
      portfolio = new Portfolio({
        userId: req.userId,
        holdings: []
      });
      await portfolio.save();
    }
    
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update portfolio
router.put('/', auth, async (req, res) => {
  try {
    const { holdings } = req.body;
    
    let portfolio = await Portfolio.findOne({ userId: req.userId });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        userId: req.userId,
        holdings
      });
    } else {
      portfolio.holdings = holdings;
      portfolio.lastUpdated = new Date();
    }
    
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 