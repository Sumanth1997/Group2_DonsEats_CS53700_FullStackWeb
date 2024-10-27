import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { menuItems } from './menuItems';

const Cart = ({ cartItems }) => {
  const [showCart, setShowCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newTotalPrice = calculateTotalPrice();
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
  
    for (const item in cartItems) {
      const itemData = Object.values(menuItems)
        .flatMap(subcategories => Object.values(subcategories))
        .flat()
        .find(i => i.title === item);
  
      if (itemData && itemData.price) {
        const price = parseFloat(itemData.price.replace(' USD', ''));
        totalPrice += price * cartItems[item];
      }
    }
  
    return totalPrice.toFixed(2);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <div className={`cart-container ${showCart ? 'show' : ''}`}>
      <button onClick={toggleCart} className="cart-button">
        Cart ({Object.keys(cartItems).reduce((sum, key) => sum + cartItems[key], 0)})
      </button>
      {showCart && (
        <div className="cart-dropdown">
          <h2>Your Cart</h2>
          <ul>
            {Object.entries(cartItems).map(([item, quantity]) => (
              quantity > 0 && (
                <li key={item}>
                  {item} x {quantity}
                </li>
              )
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total: ${totalPrice} USD</strong> 
          </div>
          <button className="checkout-button">
            Checkout
          </button>
        </div> 
      )} 
    </div>
  );
};

export default Cart;
