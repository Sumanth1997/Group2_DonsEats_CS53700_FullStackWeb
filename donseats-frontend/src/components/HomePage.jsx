import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/HomePage.css';

const restaurants = [
  { id: 2, title: "Don's at Walb", link: "/restaurants/dons-at-walb", image: "donsatwalb.jpg" },
  { id: 3, title: "Java Spot", link: "/restaurants/starbucks-java-spot", image: "starbucks.png" },
  { id: 4, title: "Einstein Bros.", link: "/restaurants/einstein-bros-bagels", image: "einstienbros.png" },
  { id: 5, title: "Bon Bon's Coffee", link: "/restaurants/bon-bons-coffee", image: "bonbons.png" },
  { id: 6, title: "Jimmy Johns", link: "/restaurants/jimmy-johns", image: "jimmyjohns.png" },
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Egg Sandwiches');
  const [bonsSelectedCategory, setBonsSelectedCategory] = useState('Coffee & Espresso'); // Default for Bon Bon's
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

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

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="homepage__header">
        <div className="header__promo">
          <p>Get 5% off your first order. <span className="promo__link">Promo: ORDER5</span></p>
        </div>
        <nav className="header__nav">
          <div className="logo">DonsEats</div>
          <ul className="nav__links">
            <li>Home</li>
            <li>Browse Menu</li>
            <li>Special Offers</li>
            <li>Restaurants</li>
            <li>Track Order</li>
            <li><button className="login-btn" onClick={handleLoginRedirect}>Login/Signup</button></li>
          </ul>
        </nav>
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
       <section className="popular-restaurants">
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
      <section className="footer__stats">
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

      <footer className="homepage__footer">
        <p>Official Purdue Fort Wayne Food Ordering Service</p>
        <p>&copy; Order4U. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
