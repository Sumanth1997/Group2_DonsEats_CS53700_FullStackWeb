import React, { useState, useEffect,useContext } from 'react';
import '../styles/Cart.css';
// import axios from 'axios'; 
import DatePicker from 'react-datepicker'; // Or any date picker library you prefer
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for the date picker
import TimePicker from 'react-time-picker'; // Or any time picker library
import 'react-time-picker/dist/TimePicker.css';
import { AuthContext } from '../services/AuthContext';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems,menuItems,restaurant }) => {
  const [showCart, setShowCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false); // To toggle checkout section
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const { user } = useContext(AuthContext);
  const location = useLocation();
    const navigate = useNavigate();

  const calculateTotalPrice = () => {
    console.log("DEBUG: Calculating Total Price");
    console.log("Cart Items:", cartItems);
    console.log("Menu Items:", menuItems);
  
    let totalPrice = 0;
  
    if (!menuItems || Object.keys(cartItems).length === 0) {
      console.log("DEBUG: No menu items or empty cart");
      return 0;
    }
  
    try {
      for (const item in cartItems) {
        console.log(`Processing item: ${item}, Quantity: ${cartItems[item]}`);
  
        // Flatten and find item strategy with more robust searching
        const itemData = Object.values(menuItems)
          .flatMap(category => 
            Object.values(category).flatMap(subcategory => 
              subcategory.filter(menuItem => menuItem.title === item)
            )
          )[0];
  
        console.log(`Found Item Data:`, itemData);
  
        if (itemData && itemData.price) {
          const price = parseFloat(itemData.price.replace(' USD', ''));
          const quantity = cartItems[item];
  
          if (!isNaN(price)) {
            const itemTotal = price * quantity;
            console.log(`Item: ${item}, Price: ${price}, Quantity: ${quantity}, Item Total: ${itemTotal}`);
            totalPrice += itemTotal;
          } else {
            console.warn(`Invalid price for item: ${item}`);
          }
        } else {
          console.warn(`Item data for "${item}" not found or price is invalid.`);
        }
      }
    } catch (error) {
      console.error("Error in total price calculation:", error);
    }
  
    console.log(`DEBUG: Final Total Price: ${totalPrice}`);
    return totalPrice.toFixed(2);
  };
  
  useEffect(() => {
    console.log("DEBUG: useEffect triggered");
    console.log("Menu Items in useEffect:", menuItems);
    console.log("Cart Items in useEffect:", cartItems);
  
    if (menuItems && Object.keys(cartItems).length > 0) { 
      const newTotalPrice = calculateTotalPrice();
      setTotalPrice(newTotalPrice);
    } else {
      setTotalPrice(0);
    }
  }, [cartItems, menuItems]);

console.log(restaurant);
  

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handleCheckoutClick = () => {
    if (Object.keys(cartItems).length > 0) {
        navigate('/checkout', { state: { cartItems, menuItems,restaurant } }); 
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


export default Cart;
