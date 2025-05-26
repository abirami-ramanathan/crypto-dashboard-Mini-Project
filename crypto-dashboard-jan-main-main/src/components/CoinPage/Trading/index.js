import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Tab, Tabs } from '@mui/material';
import { toast } from 'react-toastify';
import './styles.css';

function Trading({ coin }) {
  const [value, setValue] = useState(0); // 0 for buy, 1 for sell
  const [amount, setAmount] = useState('');
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : {};
  });

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    setAmount('');
  };

  const handleTransaction = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const coinId = coin.id;
    const currentPrice = coin.current_price || coin.price;
    const totalValue = amount * currentPrice;

    // Get user's balance from localStorage
    const userBalance = JSON.parse(localStorage.getItem('userBalance')) || 10000; // Default starting balance

    if (value === 0) { // Buy
      if (totalValue > userBalance) {
        toast.error('Insufficient balance');
        return;
      }

      const newPortfolio = {
        ...portfolio,
        [coinId]: (portfolio[coinId] || 0) + parseFloat(amount)
      };

      // Update portfolio and balance
      localStorage.setItem('portfolio', JSON.stringify(newPortfolio));
      localStorage.setItem('userBalance', JSON.stringify(userBalance - totalValue));
      setPortfolio(newPortfolio);
      toast.success(`Successfully bought ${amount} ${coin.symbol.toUpperCase()}`);
    } else { // Sell
      const ownedAmount = portfolio[coinId] || 0;
      if (amount > ownedAmount) {
        toast.error(`You only have ${ownedAmount} ${coin.symbol.toUpperCase()}`);
        return;
      }

      const newPortfolio = {
        ...portfolio,
        [coinId]: ownedAmount - parseFloat(amount)
      };

      // Update portfolio and balance
      localStorage.setItem('portfolio', JSON.stringify(newPortfolio));
      localStorage.setItem('userBalance', JSON.stringify(userBalance + totalValue));
      setPortfolio(newPortfolio);
      toast.success(`Successfully sold ${amount} ${coin.symbol.toUpperCase()}`);
    }

    setAmount('');
  };

  const userBalance = JSON.parse(localStorage.getItem('userBalance')) || 10000;
  const ownedAmount = portfolio[coin.id] || 0;

  return (
    <div className="trading-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={value} onChange={handleTabChange} centered>
          <Tab label="Buy" />
          <Tab label="Sell" />
        </Tabs>
      </Box>

      <div className="trading-info">
        <Typography variant="body1" className="balance-text">
          Balance: ${userBalance.toLocaleString()}
        </Typography>
        <Typography variant="body1" className="holdings-text">
          Holdings: {ownedAmount.toFixed(4)} {coin.symbol.toUpperCase()}
        </Typography>
        <Typography variant="body1" className="price-text">
          Current Price: ${coin.current_price?.toLocaleString() || coin.price?.toLocaleString()}
        </Typography>
      </div>

      <div className="trading-form">
        <TextField
          type="number"
          label={`Amount to ${value === 0 ? 'buy' : 'sell'}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          variant="outlined"
          className="amount-input"
        />
        <Button
          variant="contained"
          onClick={handleTransaction}
          fullWidth
          className={value === 0 ? 'buy-button' : 'sell-button'}
        >
          {value === 0 ? 'Buy' : 'Sell'} {coin.symbol.toUpperCase()}
        </Button>
      </div>
    </div>
  );
}

export default Trading; 