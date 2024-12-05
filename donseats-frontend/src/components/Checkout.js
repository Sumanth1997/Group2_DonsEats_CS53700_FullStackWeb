import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css"; // Create this CSS file for styling
import { AuthContext } from "../services/AuthContext";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, menuItems } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderType, setOrderType] = useState("now"); // 'now' or 'scheduled'
  const [scheduledTime, setScheduledTime] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (menuItems && Object.keys(cartItems).length > 0) {
      const newTotalPrice = calculateTotalPrice();
      setTotalPrice(newTotalPrice);
    } else {
      setTotalPrice(0);
    }
  }, [cartItems, menuItems]);

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
        const itemData = Object.values(menuItems).flatMap((category) =>
          Object.values(category).flatMap((subcategory) =>
            subcategory.filter((menuItem) => menuItem.title === item)
          )
        )[0];

        console.log(`Found Item Data:`, itemData);

        if (itemData && itemData.price) {
          const price = parseFloat(itemData.price.replace(" USD", ""));
          const quantity = cartItems[item];

          if (!isNaN(price)) {
            const itemTotal = price * quantity;
            console.log(
              `Item: ${item}, Price: ${price}, Quantity: ${quantity}, Item Total: ${itemTotal}`
            );
            totalPrice += itemTotal;
          } else {
            console.warn(`Invalid price for item: ${item}`);
          }
        } else {
          console.warn(
            `Item data for "${item}" not found or price is invalid.`
          );
        }
      }
    } catch (error) {
      console.error("Error in total price calculation:", error);
    }

    console.log(`DEBUG: Final Total Price: ${totalPrice}`);
    return totalPrice.toFixed(2);
  };

  const handleOrderNow = async () => {
    try {
      const orderData = {
        userId: user.uid, // Assuming you have user context
        items: cartItems,
        status: "New",
        orderPickupTime: orderType === "now" ? "Now" : scheduledTime,
      };

      const response = await axios.post(
        "http://localhost:5001/api/bagelsOrder",
        orderData
      );
      console.log("Order placed:", response.data);
      const orderId = response.data.orderId;
      console.log("Order placed with ID:", orderId);

      // Navigate to order confirmation or clear cart, etc.
      navigate('/orderConfirmation', { state: { orderId } });

    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error, display message to user
    }
  };

  const handleScheduleOrder = () => {
    // Implement scheduling logic (date/time picker, validation, etc.)
    // ... (Set scheduledTime state)
    setOrderType("scheduled"); // Update order type to trigger correct API call in handleOrderNow
  };

  // ... (rest of Checkout component JSX)

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {/* Display cart items, quantity, image, and total price */}
      <button onClick={handleOrderNow}>Order Now</button>
      <button onClick={handleScheduleOrder}>Schedule Order</button>{" "}
      {/* New button */}
    </div>
  );
};

export default Checkout;
