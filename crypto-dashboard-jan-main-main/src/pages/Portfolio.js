import React, { useEffect, useState } from 'react';
import Header from '../components/Common/Header/index.js';
import { get100Coins } from '../functions/get100Coins.js';
import { Typography, Paper, Button } from '@mui/material';
import { toast } from "react-toastify";
import './styles.css';
import { createTransaction } from '../services/api.js';

function Portfolio() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(JSON.parse(localStorage.getItem('portfolio')) || {});
  const [userBalance, setUserBalance] = useState(JSON.parse(localStorage.getItem('userBalance')) || 10000);

  useEffect(() => {
    const fetchCoins = async () => {
      const allCoins = await get100Coins();
      if (allCoins) {
        const userCoins = allCoins.filter(coin => portfolio[coin.id] && portfolio[coin.id] > 0);
        setCoins(userCoins);
      }
      setLoading(false);
    };
    fetchCoins();
  }, [portfolio]);

  const handleBuy = async (coinId, coinName, amount, price) => {
    try {
      console.log('Starting buy transaction:', { coinId, coinName, amount, price });
      const totalValue = amount * price;
      
      // Create transaction first
      const transactionResult = await createTransaction({
        type: 'buy',
        coinId,
        coinName,
        amount: parseFloat(amount),
        price: parseFloat(price),
        totalValue: parseFloat(totalValue)
      });
      console.log('Transaction created:', transactionResult);

      // Update portfolio
      const updatedHoldings = [...coins];
      // ... rest of your buy logic ...

      toast.success('Purchase successful!');
    } catch (error) {
      console.error('Buy error:', error);
      toast.error('Failed to complete purchase');
    }
  };

  const handleSell = async (coinId, coinName, amount, price) => {
    try {
      const totalValue = amount * price;
      
      // First update the portfolio
      const coinIndex = coins.findIndex(coin => coin.id === coinId);
      if (coinIndex === -1) {
        toast.error("Coin not found in portfolio");
        return;
      }

      if (coins[coinIndex].amount < amount) {
        toast.error("Insufficient coins to sell");
        return;
      }

      // Update holdings
      const updatedHoldings = [...coins];
      updatedHoldings[coinIndex].amount -= amount;
      if (updatedHoldings[coinIndex].amount === 0) {
        updatedHoldings.splice(coinIndex, 1);
      }

      // Update user balance
      const newBalance = userBalance + totalValue;
      setUserBalance(newBalance);
      localStorage.setItem('userBalance', newBalance.toString());

      // Save updated holdings
      setCoins(updatedHoldings);
      localStorage.setItem('portfolio', JSON.stringify(updatedHoldings.reduce((acc, coin) => ({ ...acc, [coin.id]: coin.amount }), {})));

      // Create transaction record
      await createTransaction({
        type: 'sell',
        coinId,
        coinName,
        amount: parseFloat(amount),
        price: parseFloat(price),
        totalValue: parseFloat(totalValue)
      });

      toast.success('Sale successful!');
    } catch (error) {
      console.error('Sell error:', error);
      toast.error('Failed to complete sale');
    }
  };

  const calculateTotalValue = () => {
    return coins.reduce((total, coin) => {
      const amount = portfolio[coin.id] || 0;
      return total + (amount * coin.current_price);
    }, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="portfolio-container">
        <Typography variant="h4" className="portfolio-heading">
          Your Portfolio
        </Typography>
        
        <div className="portfolio-stats">
          <Paper className="stats-paper">
            <Typography variant="h6">Available Balance</Typography>
            <Typography variant="h4">${userBalance.toLocaleString()}</Typography>
          </Paper>
          <Paper className="stats-paper">
            <Typography variant="h6">Portfolio Value</Typography>
            <Typography variant="h4">${calculateTotalValue().toLocaleString()}</Typography>
          </Paper>
          <Paper className="stats-paper">
            <Typography variant="h6">Total Value</Typography>
            <Typography variant="h4">${(userBalance + calculateTotalValue()).toLocaleString()}</Typography>
          </Paper>
        </div>

        <Typography variant="h5" className="holdings-heading">
          Your Holdings
        </Typography>
        
        <div className="holdings-grid">
          {coins.map(coin => {
            const amount = portfolio[coin.id];
            const value = amount * coin.current_price;
            
            return (
              <Paper key={coin.id} className="holding-paper">
                <div className="holding-info">
                  <img src={coin.image} alt={coin.name} className="coin-image" />
                  <div>
                    <Typography variant="h6">{coin.name}</Typography>
                    <Typography variant="body1">{coin.symbol.toUpperCase()}</Typography>
                  </div>
                </div>
                <div className="holding-stats">
                  <Typography variant="body1">Amount: {amount.toFixed(4)}</Typography>
                  <Typography variant="body1">Value: ${value.toLocaleString()}</Typography>
                  <div className="sell-controls">
                    <input
                      type="number"
                      placeholder="Amount to sell"
                      className="sell-input"
                      min="0"
                      max={amount}
                      step="0.0001"
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => handleSell(coin.id, coin.name, parseFloat(e.target.previousSibling.value), coin.current_price)}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              </Paper>
            );
          })}
          {coins.length === 0 && (
            <Typography variant="h6" className="no-coins">
              You don't own any cryptocurrencies yet. Visit the dashboard to start trading!
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio; 