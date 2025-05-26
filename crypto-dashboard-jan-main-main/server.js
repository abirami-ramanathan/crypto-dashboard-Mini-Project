import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Portfolio from './src/models/Portfolio.js';
import Transaction from './src/models/Transaction.js';
import jwt from 'jsonwebtoken';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
    });

    // Create empty portfolio for new user
    await Portfolio.create({
      user: user._id,
      holdings: [],
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes
app.get('/api/portfolio/:userId', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/portfolio/:userId', protect, async (req, res) => {
  try {
    const { holdings } = req.body;
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.params.userId },
      { holdings, lastUpdated: Date.now() },
      { new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/transactions/:userId', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId })
      .sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/transactions', protect, async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 