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
      
      <div className="app-container"> {/* Wrap content with app-container */}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HomePage />} /> {/* Default route */}
          <Route 
            path="/menu" 
            element={
              <> 
                <Header cartItems={cartItems} /> Header outside Routes
                {/* <NavBar onCategorySelect={handleCategorySelect} /> */}
                <Menu category={selectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
              </>
            } 
          />
        </Routes>
      </div> {/* Close app-container */}
    </Router>
  );
};

export default App;
