import React, { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Menu from './components/Menu';
import './styles/App.css';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('Coffee & Espresso');
  const [cartItems, setCartItems] = useState({});

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="app-container">
      <Header cartItems={cartItems} />
      <div className="content-wrapper"> 
        <NavBar onCategorySelect={handleCategorySelect} />
      </div>
      <Menu category={selectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default App;
