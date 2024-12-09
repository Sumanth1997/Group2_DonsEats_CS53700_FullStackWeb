import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext"; 
import FeedbackForm from "./Feedback";
import '../styles/ExploreMenu.css';
import '../styles/FoodDisplay.css';

const Menu = ({ cartItems, setCartItems }) => {
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/menuItems`);
        const data = response.data;

        // Update image URLs dynamically if needed
        const updatedData = { ...data };
        for (const categoryKey in updatedData) {
          for (const subcategory in updatedData[categoryKey]) {
            updatedData[categoryKey][subcategory] = updatedData[categoryKey][subcategory].map((item) => ({
              ...item,
              imageUrl: item.imageUrl.startsWith("http")
                ? item.imageUrl
                : `${item.imageUrl}`,
            }));
          }
        }

        setMenuItems(updatedData);

        // Set the active category to the first available category
        const categories = Object.keys(updatedData);
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [API_URL]);

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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  if (loading) {
    return <div>Loading menu items...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // If no categories or activeCategory could not be set
  if (!activeCategory) {
    return <div>No categories available.</div>;
  }

  const activeItems = menuItems[activeCategory] || {};

  return (
    <div className="einstein-menu-page">
      {/* Explore Menu: Category Scroller */}
      <div className="explore-menu">
        <h1>Einstein Bros Bagels Menu</h1>
        <div className="explore-menu-list">
          {Object.keys(menuItems).map((categoryName) => (
            <div
              key={categoryName}
              className={`explore-menu-list-item ${activeCategory === categoryName ? 'active' : ''}`}
              onClick={() => handleCategoryClick(categoryName)}
            >
              <img
                src={`/images/${categoryName.toLowerCase()}.jpg`}
                alt={categoryName}
                className={`menu-category-img ${activeCategory === categoryName ? 'highlighted' : ''}`}
                onError={(e) => {
                  if (e.target.src !== '/images/placeholder.jpg') {
                    e.target.src = '/images/placeholder.jpg'; // fallback image
                  }
                }}
              />
              <p>{categoryName}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>

      {/* Food Display: Menu Items for the activeCategory */}
      <div className="food-display">
        <h2>{activeCategory}</h2>
        {Object.entries(activeItems).map(([subcategory, subItems]) => (
          <div key={subcategory} className="menu-category">
            <h3>{subcategory}</h3>
            <div className="food-display-list">
              {subItems.map((item, index) => (
                <div key={index} className="menu-item">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="menu-item-image"
                    onError={(e) => {
                      if (e.target.src !== "/images/placeholder.jpg") {
                        e.target.src = "/images/placeholder.jpg";
                      }
                    }}
                  />
                  <div className="menu-item-details">
                    <h4>{item.title}</h4>
                    <p className="menu-item-description">{item.description}</p>
                    <p className="menu-item-price"><strong>${item.price}</strong></p>
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
        ))}
      </div>

      {/* Feedback Form */}
      <FeedbackForm user={user} />

      {/* Additional Info Section */}
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
          <p>
            If you have allergies or other dietary restrictions, please
            contact the restaurant. The restaurant will provide food-specific
            information upon request.
          </p>
          <p>Phone number: +1 (260)-123-4567</p>
          <p>
            Website:{" "}
            <a
              href="https://einsteinbagels.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://einsteinbagels.com/
            </a>
          </p>
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

export default Menu;
