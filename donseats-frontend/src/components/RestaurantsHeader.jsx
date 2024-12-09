import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import Cart from './Cart';
import { AuthContext } from '../services/AuthContext';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

const auth = getAuth(app);

const RestaurantsHeader = ({ cartItems, restaurant, menuItems, setCartItems }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to handle dropdown visibility
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  const handleHomeClick = () => {
    navigate('/'); // Redirect to the home page
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigateToTrackOrder = () => {
    navigate('/trackOrder'); // Navigate to /trackOrder when button is clicked
  };

  const handleRestaurantClick = (restaurantName) => {
    // Navigate based on restaurant title
    if (restaurantName === "Einstein Bros.") {
      navigate('/EinsteinBros', { state: { restaurant, cartItems } });
    } else if (restaurantName === "Bon Bon's Coffee") {
      navigate('/bonsmenu', { state: { restaurant, cartItems } });
    } else if (restaurantName === "Java Spot"){
      navigate('/javamenu', { state: { restaurant, cartItems } });
    } else if (restaurantName === "Don's at Walb"){
      navigate('/donsmenu', { state: { restaurant, cartItems } });
    }
    setDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <header className="header">
      <div className="header-main">
        <div className="logo">
          <h1 onClick={handleHomeClick} style={{ cursor: 'pointer' }}>DonsEats</h1>
        </div>

        <div className="restaurant-info">
          <h2>{restaurant.title}</h2>
          <p>
            Minimum Order: {restaurant.minimumOrder} USD | Delivery in {restaurant.deliveryTime} Minutes
          </p>
        </div>

        <div className="nav-items"> {/* Added this div to hold nav items */}
          <nav className="nav-links">
            <a onClick={handleHomeClick} style={{ cursor: 'pointer' }}>Home</a>

            {/* Restaurant Dropdown */}
            <div className="restaurant-dropdown">
            <a
               onClick={() => setDropdownOpen(!dropdownOpen)}
               style={{ cursor: 'pointer' }}
            >
                Restaurants
            </a>
            {dropdownOpen && (
                <div className="dropdown-menu">
                <a onClick={() => handleRestaurantClick("Don's at Walb")}>Don's at Walb</a>
                <a onClick={() => handleRestaurantClick("Java Spot")}>Java Spot</a>
                <a onClick={() => handleRestaurantClick("Einstein Bros.")}>Einstein Bros.</a>
                <a onClick={() => handleRestaurantClick("Bon Bon's Coffee")}>Bon Bon's Coffee</a>
                </div>
            )}
            </div>

            <a>Special Offers</a>
            <a onClick={navigateToTrackOrder} style={{ cursor: 'pointer' }}>Track Order</a>
          </nav>
        </div>

        <div className="header-right">
          <div className="rating">
            <span className="rating-score">{restaurant.rating}</span>
            <p>{restaurant.reviews} reviews</p>
          </div>
          <div className="restraunt-header-menu-buttons">
          <Cart cartItems={cartItems} setCartItems={setCartItems} menuItems={menuItems} restaurant={restaurant.title}/>

          {loading ? (
            <p>Loading...</p> 
          ) : user ? ( // User is logged in
            <div className="user-menu">
              <button className="logout-button" onClick={handleLogout}>Logout</button> 
            </div>
          ) : ( // User is not logged in
            <Link to="/login" className="login-button">
              Login/Signup
            </Link>
          )}
          </div>
        </div>
      </div>

      <div className="operational-time">
        <span>Open until {restaurant.operatingHours}</span>
      </div>
    </header>
  );
};

export default RestaurantsHeader;
