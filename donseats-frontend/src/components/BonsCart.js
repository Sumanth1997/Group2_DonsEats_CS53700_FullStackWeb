import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { bonsMenuItems } from './bonsMenuItems';
import DatePicker from 'react-datepicker'; // Or any date picker library you prefer
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for the date picker
import TimePicker from 'react-time-picker'; // Or any time picker library
import 'react-time-picker/dist/TimePicker.css';

const BonsCart = ({ cartItems }) => {
  const [showCart, setShowCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false); // To toggle checkout section
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const newTotalPrice = calculateTotalPrice();
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
  
    for (const item in cartItems) {
      // Find the item data ONLY within the relevant subcategory
      const itemData = Object.values(bonsMenuItems)
        .flatMap(subcategories => Object.values(subcategories)) // Get all subcategories
        .flat() // Flatten into a single array of items
        .find(i => i.title === item);
  
      if (itemData && itemData.price) {
        const price = parseFloat(itemData.price.replace(' USD', ''));
        if (!isNaN(price)) {
          totalPrice += price * cartItems[item];
        }
      } else {
        console.warn(`Item data for "${item}" not found or price is invalid.`);
      }
    }
  
    return totalPrice.toFixed(2);
  };
  

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handleCheckoutClick = () => {
    if (Object.keys(cartItems).length > 0) {
      setShowCheckout(true); 
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // Function to check if a date is a weekday (Monday - Friday)
  const isWeekday = (date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  };

  // Filter dates to enable only weekdays
  const filterWeekdays = (date) => {
    return isWeekday(date);
  };

  return (
    <div className={`cart-container ${showCart ? 'show' : ''}`}>
      <button onClick={toggleCart} className="cart-button">
        Cart ({Object.keys(cartItems).reduce((sum, key) => sum + cartItems[key], 0)})
      </button>
      {showCart && ( // Make sure Checkout button is INSIDE this block
        <div className="cart-dropdown">
          <h2>Your Cart</h2>
          {Object.keys(cartItems).length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {Object.entries(cartItems).map(([item, quantity]) => (
                quantity > 0 && (
                  <li key={item}>
                    {item} x {quantity}
                  </li>
                )
              ))}
            </ul>
          )}
          {Object.keys(cartItems).length > 0 && (
            <div className="cart-total">
              <strong>Total: ${totalPrice} USD</strong> 
            </div>
          )}

          {/* Checkout Button should be here */}
          <button
            onClick={handleCheckoutClick}
            className="checkout-button"
            disabled={Object.keys(cartItems).length === 0}
          >
            Checkout
          </button>

          {/* Checkout Section (Initially Hidden) */}
          {showCheckout && (
            <div className="checkout-section">
              <h3>Schedule Your Pickup</h3>

{/* Date Picker */}
<DatePicker
  selected={selectedDate}
  onChange={handleDateChange}
  filterDate={filterWeekdays} // Enable only weekdays
  placeholderText="Select Date"
  dateFormat="EEEE, MMMM dd" // Customize date format as needed
/>

{/* Time Picker */}
<TimePicker
  onChange={handleTimeChange}
  value={selectedTime}
  disableClock={true} // Optional: Disable the clock face
  format="h:mm a" // Customize time format
  minTime={'08:00'} // Set minimum pickup time to 8 AM
  maxTime={'19:00'} // Set maximum pickup time to 7 PM
/>
            </div>
          )}
        </div> 
      )} 
    </div>
  );
};


export default BonsCart;
