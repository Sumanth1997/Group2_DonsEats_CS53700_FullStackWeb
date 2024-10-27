import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Menu from './components/Menu';
import Header from './components/Header';
import NavBar from './components/NavBar';

import './styles/App.css'; 

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('Egg Sandwiches');
  const [cartItems, setCartItems] = useState({});

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Router>
      <Header cartItems={cartItems} /> {/* Header outside Routes */}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} /> {/* Default route */}
        <Route 
          path="/menu" 
          element={
            <div className="app-container">
              <div className="content-wrapper"> 
                <NavBar onCategorySelect={handleCategorySelect} />
              </div>
              <Menu category={selectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
