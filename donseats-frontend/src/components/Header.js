import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Header.css';
import Cart from './Cart';
import { AuthContext } from '../services/AuthContext';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

const auth = getAuth(app);
const Header = ({ cartItems }) => {
  const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize useNavigate


    const handleLogout = async () => {
      try {
          await signOut(auth);
          navigate('/login'); // Redirect after logout
      } catch (error) {
          console.error("Logout error:", error);
      }
  };
  return (
    <header className="header">
      {/* Promo Message */}
  

      {/* Main Header Content */}
      <div className="header-main">
        <div className="logo">
          <h1>DonsEats</h1>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Special Offers</a>
          <a href="#">Restaurants</a>
          <a href="#">Track Order</a>
        </nav>

        {/* Restaurant Information */}
        <div className="restaurant-info">
          <h2>Einstein's Bros. Bagels</h2>
          <p>Minimum Order: 10 USD | Delivery in 20-25 Minutes</p>
        </div>

        {/* Rating and Cart/Login Section */}
        <div className="header-right">
          <div className="rating">
            <span className="rating-score">3.4</span>
            <p>1,360 reviews</p>
          </div>
          <Cart cartItems={cartItems} />
          
          {loading ? (
              <p>Loading...</p> 
          ) : user ? ( // User is logged in
            <div className="user-menu"> {/* Wrap the user info and logout button */}
              <span className="username">{user.displayName || user.email}</span>
              <button className="logout-button" onClick={handleLogout}>Logout</button> 
            </div>
          ) : ( // User is not logged in
              <Link to="/login" className="login-button"> {/* Use Link for navigation */}
                  Login/Signup
              </Link>
            )}
        </div>
      </div>

      {/* Operational Time */}
      <div className="operational-time">
        <span>Open until 7:00 PM</span>
      </div>
    </header>
  );
};

export default Header;
