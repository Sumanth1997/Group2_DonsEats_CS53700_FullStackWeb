import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios'; // Import axios
import '../styles/Menu.css';
import { AuthContext } from "../services/AuthContext";
import FeedbackForm from './Feedback';


const BonsMenu = ({ category, cartItems, setCartItems }) => {
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDishRequest, setNewDishRequest] = useState({
      dishName: "",
      description: "",
    });
    const { user } = useContext(AuthContext);
    const [feedback, setFeedback] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;
    
    useEffect(() => {
        const fetchMenuItems = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/bons/menuItems`);
            setMenuItems(response.data);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching Bons menu items:", error);
            setError(error);
            setLoading(false);
          }
        };
    
        fetchMenuItems();
      }, []);

      if (loading) {
        return <div>Loading menu items...</div>; 
      }
    
      if (error) {
        return <div>Error: {error.message}</div>; 
      }

      const items = menuItems[category] || {};

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

  return (
    <section className="menu-section">
      {Object.entries(items).map(([subcategory, subItems]) => (
        <div key={subcategory} className="menu-category">
          <h2>{subcategory}</h2>
          <div className="menu-items">
            {subItems.map((item, index) => (
              <div key={index} className="menu-item">
                <img src={item.imageUrl} alt={item.title} className="menu-item-image" />
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
    </section>
  );
};

export default BonsMenu;