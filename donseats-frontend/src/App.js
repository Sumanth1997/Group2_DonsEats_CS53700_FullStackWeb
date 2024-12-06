import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import Signup from './components/Signup';
import Menu from './components/Menu';
import BonsMenu from './components/BonsMenu';
import Header from './components/Header';
import BonsHeader from './components/BonsHeader';
import BonsNavBar from './components/BonsNavBar';
import { AuthProvider } from './services/AuthContext'; 
import { AuthContext } from './services/AuthContext'; 
import Dashboard from './components/Dashboard';
import BonsDashboard from './components/BonsDashboard';
import { useContext } from 'react'; 
import axios from 'axios'; 
import NavBar from './components/NavBar';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import TrackOrder from './components/TrackOrder'; 

import './styles/App.css'; 
import { bonsMenuItems } from './components/bonsMenuItems';

const App = () => {
  // const [selectedCategory, setSelectedCategory] = useState('Egg Sandwiches');
  const [activeCategory, setActiveCategory] = useState('Egg Sandwiches');
  const [bonsSelectedCategory, setBonsSelectedCategory] = useState('Coffee & Espresso');
  const [einsteinCartItems, setEinsteinCartItems] = useState({});  // Einstein's cart
  const [bonsCartItems, setBonsCartItems] = useState({});        // Bon Bon's cart

  const PrivateRoute = ({ element, ...rest }) => {
    const { user } = useContext(AuthContext);
    return user ? element : <Navigate to="/login" />; // Redirect to login if no user
  };
  const [menuItems, setMenuItems] = useState({});

   useEffect(() => {
    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/menuItems');
            setMenuItems(response.data);
        } catch (error) {
            //Handle error.
        }

    };
    fetchMenuItems();
}, []);

  return (
    <AuthProvider>
    <Router>
      {/* <Header/> */}
      <div className="app-container">
      
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bonsdashboard" element={<BonsDashboard />} />
          <Route path="/checkout" element={<Checkout />} /> 
          <Route path="/orderConfirmation" element={<OrderConfirmation />} />
          <Route path='/trackOrder' element={<TrackOrder />} /> 
          {/* <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <Dashboard /> 
        </PrivateRoute>
      }
    /> */}
          <Route 
            path="/menu" 
            element={
              <> 
                <Header cartItems={einsteinCartItems} setCartItems={setEinsteinCartItems} menuItems={menuItems} />
                <NavBar onCategorySelect={setActiveCategory} activeCategory={activeCategory} />
                <Menu category={activeCategory} cartItems={einsteinCartItems} setCartItems={setEinsteinCartItems} />
              </>
            } 
          />
          <Route 
            path="/bonsmenu" 
            element={
              <> 
                <Header cartItems={bonsCartItems} setCartItems={setBonsCartItems} menuItems={bonsMenuItems} />
                <BonsNavBar onCategorySelect={setBonsSelectedCategory} activeCategory={bonsSelectedCategory} />
                <BonsMenu category={bonsSelectedCategory} cartItems={bonsCartItems} setCartItems={setBonsCartItems} />
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
