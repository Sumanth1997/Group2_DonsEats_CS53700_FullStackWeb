import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Import useLocation
import '../styles/OrderConfirmation.css'; // Create CSS file for styling

const OrderConfirmation = () => {
    const location = useLocation();
    const { orderId } = location.state || {};


    return (
        <div className="confirmation-container">
            <h2>Order Confirmed!</h2>
            <p>Your order ID is: {orderId}</p>
            {/* ... display other order details if needed */}

        </div>
    );

};


export default OrderConfirmation;
