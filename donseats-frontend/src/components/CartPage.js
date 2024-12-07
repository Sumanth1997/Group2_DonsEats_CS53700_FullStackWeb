import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, menuItems } = location.state; // Get cartItems and menuItems passed via state

  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Calculate the total price for all items in the cart
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    if (!menuItems || Object.keys(cartItems).length === 0) {
      return 0;
    }

    for (const item in cartItems) {
      const itemData = Object.values(menuItems)
        .flatMap(category => 
          Object.values(category).flatMap(subcategory => 
            subcategory.filter(menuItem => menuItem.title === item)
          )
        )[0];

      if (itemData && itemData.price) {
        const price = parseFloat(itemData.price.replace(' USD', ''));
        const quantity = cartItems[item];

        if (!isNaN(price)) {
          const itemTotalPrice = price * quantity;
          totalPrice += itemTotalPrice;
        }
      }
    }
    return totalPrice.toFixed(2);
  };

  // Update total price whenever cartItems or menuItems change
  useEffect(() => {
    const newTotalPrice = calculateTotalPrice();
    setTotalPrice(newTotalPrice);
  }, [cartItems, menuItems]);

  // Handle order placement
  const handlePlaceOrder = () => {
    if (!name || !address || !selectedDate || !selectedTime) {
      alert('Please fill in all the details before placing the order.');
      return;
    }
    // Order placing logic here
    console.log("Order Placed!");
    navigate('/'); // Redirect to home page after placing the order
  };

  return (
    <div className="cart-page">
      <h2>Your Cart Details</h2>

      {/* Display cart items with quantity and total cost for each item */}
      {Object.keys(cartItems).length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {Object.entries(cartItems).map(([item, quantity]) => {
            const itemData = Object.values(menuItems)
              .flatMap(category => 
                Object.values(category).flatMap(subcategory => 
                  subcategory.filter(menuItem => menuItem.title === item)
                )
              )[0];

            if (!itemData || !itemData.price) return null;

            const price = parseFloat(itemData.price.replace(' USD', ''));
            const itemTotalPrice = price * quantity;

            return (
              quantity > 0 && (
                <li key={item}>
                  <div>{item} x {quantity} -- ${itemTotalPrice.toFixed(2)}</div>
                </li>
              )
            );
          })}
        </ul>
      )}

      {/* Display the total price for the order */}
      <div className="cart-total">
        <strong>TotalPrice: ${totalPrice} USD</strong>
      </div>

      {/* Order placing details form */}
      <div className="order-details">
        <h3>Order Details</h3>
        <input
          type="text"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          dateFormat="MMMM dd, yyyy"
          placeholderText="Select a delivery date"
        />
        <TimePicker
          value={selectedTime}
          onChange={setSelectedTime}
          disableClock
          format="h:mm a"
          placeholder="Select a delivery time"
        />
      </div>

      {/* Place order button */}
      <button onClick={handlePlaceOrder} className="place-order-button">
        Place Order
      </button>
    </div>
  );
};

export default CartPage;
