const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, coinId, coinName, amount, price, totalValue } = req.body;
    
    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      type,
      coinId,
      coinName,
      amount,
      price,
      totalValue,
      timestamp: new Date()
    });
    
    await transaction.save();
    
    // Update user's balance
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (type === 'buy') {
      user.balance -= totalValue;
    } else {
      user.balance += totalValue;
    }
    await user.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

module.exports = router; 