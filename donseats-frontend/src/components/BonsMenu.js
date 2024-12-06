import React, { useState } from 'react';
import '../styles/ExploreMenu.css'; // Styling for category scrolling
import '../styles/FoodDisplay.css'; // Styling for menu items
import { bonsMenuItems } from './bonsMenuItems'; // Import Bon Bon's menu data

const BonsMenu = ({ cartItems, setCartItems }) => {
  const [activeCategory, setActiveCategory] = useState(Object.keys(bonsMenuItems)[0]);

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

  return (
    <div className="bons-menu-page">
      {/* Explore Menu: Category Scroller */}
      <div className="explore-menu">
        <h1>Bon Bon's Coffee Menu</h1>
        <div className="explore-menu-list">
          {Object.keys(bonsMenuItems).map((category) => (
            <div
              key={category}
              className={`explore-menu-list-item ${
                activeCategory === category ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={`/images/${category.toLowerCase()}.png`} // Dynamic category images
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
        {bonsMenuItems[activeCategory] &&
          Object.entries(bonsMenuItems[activeCategory]).map(([subcategory, items]) => (
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
          ))}
      </div>
    </div>
  );
};

export default BonsMenu;
