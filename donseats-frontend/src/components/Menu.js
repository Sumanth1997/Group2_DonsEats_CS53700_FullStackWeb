import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ExploreMenu.css'; // Styling for category scrolling
import '../styles/FoodDisplay.css'; // Styling for menu items

const EinsteinMenu = ({ cartItems, setCartItems }) => {
  const [menuItems, setMenuItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/menuItems');
        setMenuItems(response.data);
        setActiveCategory(Object.keys(response.data)[0]); // Set the first category as active
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Einstein menu items:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

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

  if (loading) {
    return <div>Loading Einstein menu items...</div>;
  }

  if (error) {
    return <div>Error fetching menu: {error.message}</div>;
  }

  const items = menuItems[activeCategory] || {};

  return (
    <div className="einstein-menu-page">
      {/* Explore Menu: Category Scroller */}
      <div className="explore-menu">
        <h1>Einstein Bros Bagels Menu</h1>
        <div className="explore-menu-list">
          {Object.keys(menuItems).map((category) => (
            <div
              key={category}
              className={`explore-menu-list-item ${
                activeCategory === category ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={`/images/${category.toLowerCase()}.jpg`} // Dynamic category images
                alt={category}
                className={`menu-category-img ${
                  activeCategory === category ? 'highlighted' : ''
                }`}
              />
              <p>{category}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>

      {/* Food Display: Menu Items */}
      <div className="food-display">
        <h2>{activeCategory}</h2>
        {Object.entries(items).map(([subcategory, subItems]) => (
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
                      if (e.target.src !== '/images/placeholder.jpg') {
                        e.target.src = '/images/placeholder.jpg'; // Fallback image
                      }
                    }}
                  />
                  <div className="menu-item-details">
                    <h4>{item.title}</h4>
                    <p className="menu-item-description">{item.description}</p>
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
        ))}
      </div>
    </div>
  );
};

export default EinsteinMenu;
