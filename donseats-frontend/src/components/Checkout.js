import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";
import { AuthContext } from "../services/AuthContext";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, menuItems } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderType, setOrderType] = useState("now");
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
    let totalPrice = 0;

    if (!menuItems || Object.keys(cartItems).length === 0) {
      return 0;
    }

    try {
      for (const item in cartItems) {
        const itemData = Object.values(menuItems).flatMap((category) =>
          Object.values(category).flatMap((subcategory) =>
            subcategory.filter((menuItem) => menuItem.title === item)
          )
        )[0];

        if (itemData && itemData.price) {
          const price = parseFloat(itemData.price.replace(" USD", ""));
          const quantity = cartItems[item];

          if (!isNaN(price)) {
            totalPrice += price * quantity;
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

    return totalPrice.toFixed(2);
  };

  const handleOrderNow = async () => {
    try {
      const orderData = {
        userId: user.uid,
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

      navigate('/orderConfirmation', { state: { orderId } });

    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleScheduleOrder = () => {
    setOrderType("scheduled");
  };


  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Item List */}
      <ul className="checkout-items">
        {Object.entries(cartItems).map(([itemName, quantity]) => {
          const itemData = Object.values(menuItems)
            .flatMap(category => Object.values(category))
            .flat()
            .find(item => item.title === itemName);

          return (
            itemData && (
              <li key={itemName} className="checkout-item">
                <img src={itemData.imageUrl} alt={itemName} className="checkout-item-image" />
                <div className="checkout-item-details">
                  <span>{itemName}</span>
                  <span>Quantity: {quantity}</span>
                  <span>Price: ${itemData.price}</span> {/* Display individual item price */}
                </div>
              </li>
            )
          );
        })}
      </ul>


      {/* Total Price */}
      <h3>Total: ${totalPrice}</h3>

      <button onClick={handleOrderNow}>Order Now</button>
      <button onClick={handleScheduleOrder}>Schedule Order</button>
      {orderType === "scheduled" && (
          <input
              type="datetime-local" // Use datetime-local for combined date and time
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} // Set minimum to current date and time
           />
       )}
    </div>
  );
};

export default Checkout;

