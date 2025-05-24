// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
    };
    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const clearAll = () => setTransactions([]);

  const getIncome = () =>
    transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const getExpenses = () =>
    transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  const getBalance = () => getIncome() + getExpenses();

  return (
    <div className="app">
      <div className="tabs">
        <button onClick={() => setActiveTab('tracker')} className={activeTab === 'tracker' ? 'active' : ''}>💰 Трекер</button>
        <button onClick={() => setActiveTab('calculator')} className={activeTab === 'calculator' ? 'active' : ''}>🔢 Калькулятор</button>
      </div>

      {activeTab === 'tracker' ? (
        <div className="tracker">
          <div className="summary">
            <h2>Баланс: {getBalance().toFixed(2)} ₽</h2>
            <p>Доходы: {getIncome().toFixed(2)} ₽</p>
            <p>Расходы: {Math.abs(getExpenses()).toFixed(2)} ₽</p>
          </div>

          <form onSubmit={addTransaction} className="form">
            <input type="text" placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Сумма" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button type="submit">Добавить</button>
          </form>

          <button onClick={clearAll} className="clear">Очистить всё</button>

          <ul className="transactions">
            {transactions.map((t) => (
              <li key={t.id} className={t.amount >= 0 ? 'income' : 'expense'}>
                <span>{t.description}: {t.amount} ₽</span>
                <button onClick={() => deleteTransaction(t.id)}>✖</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Calculator />
      )}
    </div>
  );
}

function Calculator() {
  const [input, setInput] = useState('');

  const handleClick = (value) => setInput((prev) => prev + value);
  const handleClear = () => setInput('');
  const handleEqual = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Ошибка');
    }
  };

  return (
    <div className="calculator">
      <input type="text" value={input} readOnly />
      <div className="buttons">
        {'1234567890+-*/.'.split('').map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
        ))}
        <button onClick={handleClear}>C</button>
        <button onClick={handleEqual}>=</button>
      </div>
    </div>
  );
}
