import React from 'react';
import '../styles/Header.css';
import Cart from './Cart';

const Header = ({ cartItems }) => {
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
          <h2>Einstein's Bagels</h2>
          <p>Minimum Order: 10 GBP | Delivery in 20-25 Minutes</p>
        </div>

        {/* Rating and Cart/Login Section */}
        <div className="header-right">
          <div className="rating">
            <span className="rating-score">3.4</span>
            <p>1,360 reviews</p>
          </div>
          <Cart cartItems={cartItems} />
          
          <button className="login-button">Login/Signup</button>
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
