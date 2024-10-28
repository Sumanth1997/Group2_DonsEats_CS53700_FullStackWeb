import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Menu from './components/Menu';
import BonsMenu from './components/BonsMenu';
import Header from './components/Header';
import BonsHeader from './components/BonsHeader';

import './styles/App.css'; 

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('Egg Sandwiches');
  const [bonsSelectedCategory, setBonsSelectedCategory] = useState('Coffee & Espresso');
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
                <Header cartItems={cartItems} /> 
                <Menu category={selectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
              </>
            } 
          />
          <Route 
            path="/bonsmenu" 
            element={
              <> 
                <BonsHeader cartItems={cartItems} /> 
                {/* <NavBar onCategorySelect={handleCategorySelect} /> */}
                <BonsMenu category={bonsSelectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
              </>
            } 
          />
        </Routes>
      </div> {/* Close app-container */}
    </Router>
  );
};

export default App;
