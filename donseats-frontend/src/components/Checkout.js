import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";
import { AuthContext } from "../services/AuthContext";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, menuItems,restaurant } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderType, setOrderType] = useState("now");
  const [scheduledTime, setScheduledTime] = useState("");
  const { user } = useContext(AuthContext);
  const [paymentMade, setPaymentMade] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  console.log(cartItems);
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
    if (!user) {
      setShowModal(true); // Show the modal instead of alert
      return;
    }
    try {
      const orderData = {
        userId: user.uid,
        items: cartItems,
        status: "New",
        orderPickupTime: orderType === "now" ? "Now" : scheduledTime,
        restaurant: restaurant || "Unknown Restaurant"
      };

      const response = await axios.post(
        "/api/bagelsOrder",
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

  const handlePayNowClick = () => {
    setPaymentMade(true); // Simulate successful payment
};

  const removeItemFromCart = (itemName) => {
    const updatedCartItems = { ...cartItems };
    delete updatedCartItems[itemName];
    // Update cartItems state in the parent component
    // If you're using a context or prop, you might need to trigger an update
    navigate(0);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {showModal && (
        <div className="modal">  {/* Add a CSS class for styling */}
          <div className="modal-content"> {/* Add a CSS class for styling */}
            <p>Please log in to place an order.</p>
            <button onClick={() => {
              setShowModal(false);
              navigate('/login');
            }}>Go to Login</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

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
    <span className="delete-icon" onClick={() => removeItemFromCart(itemName)}>
      <i className="fas fa-times"></i>
    </span>
    <span className="item-name">{itemName}</span> {/* Applied class to the item name */}
    <div className="quantity-price">
      <span className="item-quantity">Quantity: {quantity}</span>
      <span className="item-price">Price: ${itemData.price}</span>
    </div>
  </div>
</li>

            )
          );
        })}
      </ul>

      {/* Total Price */}
      <h3>Total: ${totalPrice}</h3>

      <button onClick={handleScheduleOrder}>Schedule Order</button>
      {orderType === "scheduled" && (
        <input
          className="schedule_input"
          type="datetime-local" // Use datetime-local for combined date and time
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)} // Set minimum to current date and time
        />
      )}

<button onClick={handlePayNowClick} disabled={paymentMade}>
                {paymentMade ? "Payment Complete" : "Pay Now (Simulated)"}
            </button>

          
            <button onClick={handleOrderNow} disabled={!paymentMade}>
                Order Now
            </button>

    </div>
  );
};

export default Checkout;