import React, { useState } from 'react';
import '../styles/NavBar.css';

const NavBar = ({ onCategorySelect }) => {
  const categories = ['Egg Sandwiches', 'Signature Lunch', 'Beverages', 'Espresso'];
  const [activeCategory, setActiveCategory] = useState(categories[0]); // Set the initial active category

  const handleCategorySelect = (category) => {
    setActiveCategory(category); // Update the active category
    onCategorySelect(category); // Trigger selection on click
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
