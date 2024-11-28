import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
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
import { useContext } from 'react'; 
import axios from 'axios'; 

import './styles/App.css'; 

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('Egg Sandwiches');
  const [bonsSelectedCategory, setBonsSelectedCategory] = useState('Coffee & Espresso');
  const [cartItems, setCartItems] = useState({});
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
                <Header cartItems={cartItems} setCartItems={setCartItems} menuItems={menuItems} />
                <Menu category={selectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
              </>
            } 
          />
          <Route 
            path="/bonsmenu" 
            element={
              <> 
                <BonsHeader cartItems={cartItems} /> 
                <BonsMenu category={bonsSelectedCategory} cartItems={cartItems} setCartItems={setCartItems} />
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
