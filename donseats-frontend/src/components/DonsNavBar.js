import React, { useState } from 'react';
import '../styles/NavBar.css';

const BonsNavBar = ({ onCategorySelect }) => {
  const categories = ['Epic Eats', 'Mozzie\'s', 'Deliss', 'Central Grill Co.','Saborijos','Weekly Grill Specials'];
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
            className={`navbar-item ${category === activeCategory ? 'active' : ''}`} // Add active class
          >
            {category}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BonsNavBar;
