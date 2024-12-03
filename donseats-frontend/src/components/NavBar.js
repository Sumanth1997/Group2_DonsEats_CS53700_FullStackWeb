import React from 'react';
import '../styles/NavBar.css';

const NavBar = ({ onCategorySelect, activeCategory }) => { // Receive props
  const categories = ['Egg Sandwiches', 'Signature Lunch', 'Beverages', 'Espresso'];

  const handleCategorySelect = (category) => {
    onCategorySelect(category); // Call the function received from App
  };

  return (
    // ... rest of the NavBar code, use activeCategory prop for highlighting
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
};

export default NavBar;
