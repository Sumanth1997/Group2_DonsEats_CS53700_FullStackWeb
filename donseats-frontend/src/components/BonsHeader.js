import React from 'react';
import '../styles/Header.css';
import Cart from './BonsCart';

const BonsHeader = ({ cartItems }) => {
  return (
    <header className="header">
      <div className="header-main">
        <div className="logo">
          <h1>DonsEats</h1>
        </div>

        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Special Offers</a>
          <a href="#">Restaurants</a>
          <a href="#">Track Order</a>
        </nav>

        <div className="restaurant-info">
          <h2>Bon Bon's Coffee</h2>
          <p>Minimum Order: 5 USD | Delivery in 15-20 Minutes</p>
        </div>

        <div className="header-right">
          <div className="rating">
            <span className="rating-score">4.8</span>
            <p>1,500 reviews</p>
          </div>
          <Cart cartItems={cartItems} />
          <button className="login-button">Login/Signup</button>
        </div>
      </div>

      <div className="operational-time">
        <span>Open until 9:00 PM</span>
      </div>
    </header>
  );
};

export default BonsHeader;