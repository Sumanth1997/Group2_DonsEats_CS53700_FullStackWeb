import React, { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Menu from './components/Menu';
 

import './styles/App.css'; // Import your main CSS file

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('Egg Sandwiches');
  const [cartItems, setCartItems] = useState({});

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="app-container">
      <Header cartItems={cartItems} /> {/* Pass cartItems to Header */}
      <div className="content-wrapper"> 
        <NavBar onCategorySelect={handleCategorySelect} />
      </div>
      <Menu category={selectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default App;