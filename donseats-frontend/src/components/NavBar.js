import React, { useState } from 'react';
import '../styles/NavBar.css';

const NavBar = ({ onCategorySelect }) => {
  const categories = ['Coffee & Espresso', 'Refreshers', 'Smoothies', 'Shakes'];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    onCategorySelect(category);
  };

  return (
    <nav className="navbar">
      <ul>
        {categories.map((category, index) => (
          <li 
            key={index} 
            onClick={() => handleCategorySelect(category)}
            className={`navbar-item ${category === activeCategory ? 'active' : ''}`}
          >
            {category}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
