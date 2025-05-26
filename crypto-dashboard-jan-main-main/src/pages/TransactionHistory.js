import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './styles.css';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      if (user) {
        fetchTransactions();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  if (loading && transactions.length === 0) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      <button 
        onClick={fetchTransactions}
        className="refresh-button"
      >
        Refresh
      </button>
      <div className="transaction-list">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction._id} className="transaction-item">
              <div className="transaction-info">
                <span className="coin-name">{transaction.coinName}</span>
                <span className={`transaction-type ${transaction.type}`}>
                  {transaction.type.toUpperCase()}
                </span>
              </div>
              <div className="transaction-details">
                <span>Amount: {transaction.amount}</span>
                <span>Price: ${transaction.price.toFixed(2)}</span>
                <span>Total: ${transaction.totalValue.toFixed(2)}</span>
                <span>Date: {new Date(transaction.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionHistory; 