import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext"; // Import AuthContext
import FeedbackForm from "./Feedback";

const Menu = ({ category, cartItems, setCartItems }) => {
  const [menuItems, setMenuItems] = useState({}); // Store menu items from backend
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch menu items from backend
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("/api/menuItems");
        const data = response.data;

        // Update image URLs dynamically
        const updatedData = { ...data };
        for (const category in updatedData) {
          for (const subcategory in updatedData[category]) {
            updatedData[category][subcategory] = updatedData[category][subcategory].map((item) => ({
              ...item,
              imageUrl: item.imageUrl.startsWith("http")
                ? item.imageUrl
                : `${item.imageUrl}`,
            }));
          }
        }

        setMenuItems(updatedData);
        setLoading(false); // Stop loading
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(err); // Set error state
        setLoading(false); // Stop loading on error
      }
    };

    fetchMenuItems();
  }, []); // Empty dependency array ensures it runs only once on mount

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

  if (loading) {
    return <div>Loading menu items...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message
  }

  // Safely access items after data is loaded and no error
  const items = menuItems[category] || {};

  return (
    <div className="app-container">
      <section className="menu-section">
        {Object.entries(items).map(([subcategory, subItems]) => (
          <div key={subcategory} className="menu-category">
            <h2>{subcategory}</h2>
            <div className="menu-items">
              {subItems.map((item, index) => (
                <div key={index} className="menu-item">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="menu-item-image"
                    onError={(e) => {
                      if (e.target.src !== "/images/bonbons.jpg") {
                        e.target.src = "/images/bonbons.jpg";
                      }
                    }}
                  />

                  <div className="menu-item-details">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="menu-item-price">${item.price}</span>
                  </div>
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
              ))}
            </div>
          </div>
        ))}

        <FeedbackForm user={user} />

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
      </section>
    </div>
  );
};

export default Menu;
