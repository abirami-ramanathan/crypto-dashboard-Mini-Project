import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  holdings: [{
    coinId: String,
    amount: Number,
    averageBuyPrice: Number,
    lastUpdated: Date,
  }],
  totalValue: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio; 