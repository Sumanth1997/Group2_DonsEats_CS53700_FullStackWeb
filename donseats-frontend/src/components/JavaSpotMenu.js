import React, { useState } from 'react';
import '../styles/ExploreMenu.css'; 
import '../styles/FoodDisplay.css'; 
import { menuItems } from './JavaSpotMenuItems';

const JavaSpotMenu = ({ cartItems, setCartItems }) => {
  const [activeCategory, setActiveCategory] = useState(Object.keys(menuItems)[0]);

  const handleCategoryClick = (category) => setActiveCategory(category);

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
    <div className="menu-page">
      <div className="explore-menu">
        <h1>Java Spot Coffee Menu</h1>
        <div className="explore-menu-list">
          {Object.keys(menuItems).map((category) => (
            <div
              key={category}
              className={`explore-menu-list-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <img src={`/images/${category.toLowerCase()}.jpg`} alt={category} />
              <p>{category}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>

      <div className="food-display">
        <h2>{activeCategory}</h2>
        {menuItems[activeCategory] &&
          Object.entries(menuItems[activeCategory]).map(([subcategory, items]) => (
            <div key={subcategory} className="menu-category">
              <h3>{subcategory}</h3>
              <div className="food-display-list">
                {items.map((item, index) => (
                  <div key={index} className="menu-item">
                    <img src={item.imageUrl} alt={item.title} />
                    <div className="menu-item-details">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <p className="menu-item-price">${item.price}</p>
                      <div className="menu-item-actions">
                        <button onClick={() => handleRemoveFromCart(item.title)} disabled={!cartItems[item.title]}>-</button>
                        <span>{cartItems[item.title] || 0}</span>
                        <button onClick={() => handleAddToCart(item.title)}>+</button>
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

export default JavaSpotMenu;
