import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Menu from './components/Menu';
import BonsMenu from './components/BonsMenu';
import Header from './components/Header';
import BonsHeader from './components/BonsHeader';
import { AuthProvider } from './services/AuthContext';
import { AuthContext } from './services/AuthContext';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import TrackOrder from './components/TrackOrder';
import JavaSpotMenu from './components/JavaSpotMenu';
import JavaHeader from './components/JavaHeader';
import DonsAtWalbMenu from './components/DonsAtWalbMenu'; // Import Dons menu
import DonsHeader from './components/DonsHeader'; // Import Dons header

import './styles/App.css';

const App = () => {
  const [cartItems, setCartItems] = useState({});
  const PrivateRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    return user ? element : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orderConfirmation" element={<OrderConfirmation />} />
            <Route path="/trackOrder" element={<TrackOrder />} />

            <Route
              path="/menu"
              element={
                <>
                  <Header cartItems={cartItems} setCartItems={setCartItems} />
                  <Menu cartItems={cartItems} setCartItems={setCartItems} />
                </>
              }
            />

            <Route
              path="/bonsmenu"
              element={
                <>
                  <BonsHeader cartItems={cartItems} />
                  <BonsMenu cartItems={cartItems} setCartItems={setCartItems} />
                </>
              }
            />

            <Route
              path="/javaspotmenu"
              element={
                <>
                  <JavaHeader cartItems={cartItems} />
                  <JavaSpotMenu cartItems={cartItems} setCartItems={setCartItems} />
                </>
              }
            />

            <Route
              path="/donsatwalbmenu"
              element={
                <>
                  <DonsHeader cartItems={cartItems} />
                  <DonsAtWalbMenu cartItems={cartItems} setCartItems={setCartItems} />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
