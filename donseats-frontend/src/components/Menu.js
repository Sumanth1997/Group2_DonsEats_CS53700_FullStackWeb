import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../styles/Header.css";
import "../styles/NavBar.css";
import "../styles/Menu.css";
import Cart from "./Cart";
import { AuthContext } from "../services/AuthContext"; // Make sure to import AuthContext

// import { menuItems } from './menuItems';

const Menu = ({ category, cartItems, setCartItems }) => {
  const [menuItems, setMenuItems] = useState({}); // Store menu items from backend
  // const [activeCategory, setActiveCategory] = useState({});
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const categories = Object.keys(menuItems); // Get categories dynamically
  const [newDishRequest, setNewDishRequest] = useState({
    dishName: "",
    description: "",
  });
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const updateImageUrls = async () => {
      // Make this function async
      if (!menuItems || Object.keys(menuItems).length === 0) {
        return; // Nothing to update
      }

      const updatedMenuItems = { ...menuItems }; // Create a copy

      for (const category in updatedMenuItems) {
        for (const subcategory in updatedMenuItems[category]) {
          for (const item of updatedMenuItems[category][subcategory]) {
            console.log(item.imageUrl);
            if (!item.imageUrl.startsWith("http")) {
              // Check if it's a local path
              item.imageUrl = `${item.imageUrl}`; // Prepend /Images/
            }
          }
        }
      }
      setMenuItems(updatedMenuItems);
    };

    updateImageUrls(); // Call the async function
  }, [menuItems]); // Add menuItems as a dependency

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/menuItems");
        setMenuItems(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setError(error); // Set error state
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchMenuItems();
  }, [category]);

  // const handleCategorySelect = (category) => {
  //     setActiveCategory(category);
  // };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        // Check if user is logged in
        alert("You must be logged in to request a new dish.");
        return;
      }
      const response = await axios.post(
        "http://localhost:5001/api/requestNewDish",
        {
          dishName: newDishRequest,
          userId: user.uid,
        }
      );

      console.log("Dish request submitted:", response.data);
      alert("Your dish request has been submitted!");
      setNewDishRequest(""); // Clear the input field
    } catch (error) {
      console.error("Error submitting dish request:", error);
      alert(
        "There was an error submitting your request. Please try again later."
      ); // User-friendly error message
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
        "http://localhost:5001/api/submitFeedback",
        {
          feedback,
          userId: user.uid, // Include the user's UID
          restaurantId: "einstein_bagels", // Or however you identify the restaurant
        }
      );

      console.log("Feedback submitted:", response.data);
      setFeedback(""); // Clear the feedback input
      setFeedbackSubmitted(true); // Set feedback submitted state
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting your feedback. Please try again.");
    }
  };

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

        <form onSubmit={handleFeedbackSubmit}>
          <h2>Feedback</h2>
          {feedbackSubmitted ? ( // Conditional rendering of the form
            <p>Thank you for your feedback!</p> // Or render something else after feedback is submitted
          ) : (
            <>
              {" "}
              {/* Fragment to wrap multiple elements*/}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback here"
                rows="4" // Adjust as needed
                required
              />
              <button type="submit">Submit Feedback</button>
            </>
          )}
        </form>

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
