import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/ExploreMenu.css'; // Use the same styles as in Version 1
import '../styles/FoodDisplay.css'; // Use the same styles as in Version 1
import { AuthContext } from "../services/AuthContext";
import FeedbackForm from './Feedback';

const BonsMenu = ({ cartItems, setCartItems }) => {
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bons/menuItems`);
        setMenuItems(response.data);
        const categories = Object.keys(response.data);
        if (categories.length > 0) {
          setActiveCategory(categories[0]); // Set the first category as active by default
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Bons menu items:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [API_URL]);

  if (loading) {
    return <div>Loading menu items...</div>; 
  }

  if (error) {
    return <div>Error: {error.message}</div>; 
  }

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleAddToCart = (itemId) => {
    setCartItems((prevCartItems) => ({
      ...prevCartItems,
      [itemId]: (prevCartItems[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prevCartItems) => {
      if (prevCartItems[itemId] > 1) {
        return {
          ...prevCartItems,
          [itemId]: prevCartItems[itemId] - 1,
        };
      } else {
        const { [itemId]: _, ...rest } = prevCartItems;
        return rest;
      }
    });
  };

  const categories = Object.keys(menuItems);
  const activeItems = activeCategory ? menuItems[activeCategory] : {};

  return (
    <div className="bons-menu-page">
      {/* Explore Menu: Category Scroller (from Version 1) */}
      <div className="explore-menu">
        <h1>Bon Bon's Coffee Menu</h1>
        <div className="explore-menu-list">
          {categories.map((category) => (
            <div
              key={category}
              className={`explore-menu-list-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={`/images/${category.toLowerCase()}.png`}
                alt={category}
                className={`menu-category-img ${activeCategory === category ? 'highlighted' : ''}`}
                onError={(e) => {
                  if (e.target.src !== '/images/placeholder.jpg') {
                    e.target.src = '/images/placeholder.jpg'; // fallback image
                  }
                }}
              />
              <p>{category}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>

      {/* Food Display: Menu Items (as in Version 1 style) */}
      <div className="food-display">
        {activeCategory && <h2>{activeCategory}</h2>}
        {activeItems && 
          Object.entries(activeItems).map(([subcategory, items]) => (
            <div key={subcategory} className="menu-category">
              <h3>{subcategory}</h3>
              <div className="food-display-list">
                {items.map((item, index) => (
                  <div key={index} className="menu-item">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="menu-item-image"
                      onError={(e) => {
                        if (e.target.src !== '/images/placeholder.jpg') {
                          e.target.src = '/images/placeholder.jpg'; // Fallback image
                        }
                      }}
                    />
                    <div className="menu-item-details">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <p className="menu-item-price">
                        <strong>${item.price}</strong>
                      </p>
                      {/* Cart Actions */}
                      <div className="menu-item-actions">
                        <button
                          className="decrement-button"
                          onClick={() => handleRemoveFromCart(item.title)}
                          disabled={!cartItems[item.title]}
                        >
                          -
                        </button>
                        <span>{cartItems[item.title] || 0}</span>
                        <button
                          className="increment-button"
                          onClick={() => handleAddToCart(item.title)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>

      {/* Feedback Form */}
      <FeedbackForm user={user} />

      {/* Info section */}
      <section className="info-section">
        <div className="info-box delivery-info">
          <h3>Delivery Information</h3>
          <p>Monday: 12:00 AM–3:00 AM, 8:00 AM–3:00 AM</p>
          <p>Tuesday: 8:00 AM–3:00 AM</p>
          <p>Wednesday: 8:00 AM–3:00 AM</p>
          <p>Thursday: 8:00 AM–3:00 AM</p>
          <p>Friday: 8:00 AM–3:00 AM</p>
          <p>Saturday: 8:00 AM–3:00 AM</p>
          <p>Sunday: 8:00 AM–12:00 AM</p>
          <p>Estimated time until delivery: 20 min</p>
        </div>
        
        <div className="info-box contact-info">
          <h3>Contact Information</h3>
          <p>If you have allergies or other dietary restrictions, please contact the restaurant. The restaurant will provide food-specific information upon request.</p>
          <p>Phone number: +1 (260)-123-4567</p>
          <p>Website: <a href="https://bonbonscoffee.com/" target="_blank" rel="noopener noreferrer">https://bonbonscoffee.com/</a></p>
        </div>

        <div className="info-box operational-times">
          <h3>Operational Times</h3>
          <p>Monday: 8:00 AM–3:00 AM</p>
          <p>Tuesday: 8:00 AM–3:00 AM</p>
          <p>Wednesday: 8:00 AM–3:00 AM</p>
          <p>Thursday: 8:00 AM–3:00 AM</p>
          <p>Friday: 8:00 AM–3:00 AM</p>
          <p>Saturday: 8:00 AM–3:00 AM</p>
          <p>Sunday: 8:00 AM–3:00 AM</p>
        </div>
      </section>
    </div>
  );
};

export default BonsMenu;
