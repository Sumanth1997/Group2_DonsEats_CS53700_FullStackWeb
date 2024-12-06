import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import './../styles/HomePage.css';
import app from '../services/firebaseConfig';
const auth = getAuth(app);

const restaurants = [
  { id: 1, title: "Don's at Walb", link: "/restaurants/dons-at-walb", image: "donsatwalb.jpg" },
  { id: 2, title: "Java Spot", link: "/restaurants/starbucks-java-spot", image: "starbucks.png" },
  { id: 3, title: "Einstein Bros.", link: "/restaurants/einstein-bros-bagels", image: "einstienbros.png" },
  { id: 4, title: "Bon Bon's Coffee", link: "/restaurants/bon-bons-coffee", image: "bonbons.png" },
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Egg Sandwiches');
  const [bonsSelectedCategory, setBonsSelectedCategory] = useState('Coffee & Espresso'); // Default for Bon Bon's
  const [cartItems, setCartItems] = useState({});
  const { user, loading } = useContext(AuthContext);
    
  const navigate = useNavigate();
  const restaurantsRef = useRef(null); // Create ref for the restaurants section

  const handleRestaurantClick = (restaurant) => {
    if (restaurant.title === "Einstein Bros.") {
      navigate('/menu', { state: { restaurant, selectedCategory, cartItems } });
    } else if (restaurant.title === "Bon Bon's Coffee") {
      navigate('/bonsmenu', { state: { restaurant, bonsSelectedCategory, cartItems } });
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to the login page
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Scroll to the restaurants section when clicked
  const handleScrollToRestaurants = () => {
    restaurantsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="homepage__header">
        <div className="header__promo">
          <p>Get 5% off your first order. <span className="promo__link">Promo: ORDER5</span></p>
        </div>
        <div className="header__content">
          <div className="header__logo">
            <div className="logo">DonsEats</div>
          </div>
          <div className='header_right'>
          <div className="header__links">
            <nav className="header__nav">
              <ul className="nav__links">
                <li>Special Offers</li>
                <li onClick={handleScrollToRestaurants}>Restaurants</li> {/* Trigger scroll to Popular Restaurants */}
              </ul>
            </nav>
          </div>
          <div className="header__user">
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <div className="user-menu">
                <button className="username-btn">
                  Welcome, {user.displayName || user.email}!
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={handleLoginRedirect}>Login/Signup</button>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="homepage__hero">
        <div className="hero__content">
          <h1>Get your Food Anywhere on-campus</h1>
          <p>Order on-campus restaurant food for takeaway</p>
          <div className="hero__search">
            <input type="text" placeholder="Enter Delivery address" />
            <button>Search</button>
          </div>
        </div>
        <div className="hero__image">
          <img src="headerelephant.png" alt="Elephant holding burger" />
        </div>
      </section>

       {/* Popular Restaurants */}
       <section className="popular-restaurants" ref={restaurantsRef}>
        <h3>Popular Restaurants</h3>
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div
              className="restaurant-card"
              key={restaurant.id}
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <img src={restaurant.image} alt={restaurant.title} className="restaurant-card__image" />
              <button className="restaurant-card__button">{restaurant.title}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <div  className="footer__stats">
      <section className='fo_stats'>
        <div>
          <p>6</p>
          <span>Restaurants</span>
        </div>
        <div>
          <p>100+</p>
          <span>Dishes</span>
        </div>
        <div>
          <p>100+</p>
          <span>Drinks</span>
        </div>
        <div>
          <p>5+</p>
          <span>Cuisines</span>
        </div>
      </section>
      </div>

      <footer className="homepage__footer">
        <p>Official Purdue Fort Wayne Food Ordering Service</p>
        <p>&copy; Order4U. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
