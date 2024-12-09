import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import '../styles/ExploreMenu.css'; // For category scrolling styling
import '../styles/FoodDisplay.css'; // For menu items styling
import '../styles/Menu.css';       // Keep your original styling if needed
import "./Feedback"; // Import the FeedbackForm.css file
import { AuthContext } from "../services/AuthContext";

const DonsMenu = ({ cartItems, setCartItems }) => {
  const [menuItems, setMenuItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDishRequest, setNewDishRequest] = useState("");
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dons/menuItems`);
        const data = response.data;
        setMenuItems(data);

        const categories = Object.keys(data);
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Don's menu items:", error);
        setError(error);
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

  if (!activeCategory) {
    return <div>No categories available.</div>;
  }

  const activeItems = menuItems[activeCategory] || {};

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        alert("You must be logged in to request a new dish.");
        return;
      }
      const response = await axios.post(
        `${API_URL}/api/dons/requestNewDish`,
        {
          dishName: newDishRequest,
          userId: user.uid,
        }
      );
      console.log("Dish request submitted:", response.data);
      alert("Your dish request has been submitted!");
      setNewDishRequest(""); 
    } catch (error) {
      console.error("Error submitting dish request:", error);
      alert("There was an error submitting your request. Please try again later.");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        alert("You must be logged in to submit feedback.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/submitFeedback`,
        {
          feedback,
          userId: user.uid,
          restaurantId: "dons",
        }
      );

      console.log("Feedback submitted:", response.data);
      setFeedback(""); 
      setFeedbackSubmitted(true); 
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting your feedback. Please try again.");
    }
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="menu-page">
      {/* Explore Menu: Category Scroller */}
      <div className="explore-menu-list">
        {Object.keys(menuItems).map((categoryName) => (
          <div
            key={categoryName}
            className={`explore-menu-list-item ${activeCategory === categoryName ? 'active' : ''}`}
            onClick={() => handleCategoryClick(categoryName)}
          >
            <p className={activeCategory === categoryName ? 'highlighted-text' : ''}>
              {categoryName}
            </p>
          </div>
        ))}
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
                    <p>{item.description}</p>
                    <p className="menu-item-price">${item.price}</p>
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

      {/* Dish and Feedback Forms Container */}
      <div className="dish-feedback-container">
        {/* Form to request a new dish */}
        <form onSubmit={handleSubmit}>
          <h2>Request a New Dish</h2>
          <input
            type="text"
            placeholder="Dish Name"
            value={newDishRequest}
            onChange={(e) => setNewDishRequest(e.target.value)}
            required
          />
          <button type="submit">Submit Request</button>
        </form>

        {/* Feedback Form */}
        <form onSubmit={handleFeedbackSubmit}>
          <h2>Feedback</h2>
          {feedbackSubmitted ? (
            <p>Thank you for your feedback!</p>
          ) : (
            <>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback here"
                rows="4"
                required
              />
              <button type="submit">Submit Feedback</button>
            </>
          )}
        </form>
      </div>

      {/* Info Section */}
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

export default DonsMenu;
