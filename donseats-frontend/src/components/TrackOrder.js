import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TrackOrder.css';
import { AuthContext } from '../services/AuthContext';

const TrackOrder = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [userOrders, setUserOrders] = useState([]);
    const [ordersByRestaurant, setOrdersByRestaurant] = useState({});
    const API_URL = process.env.REACT_APP_API_URL;
    const [expandedRestaurant, setExpandedRestaurant] = useState(null);



    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/api/bagelsOrder/user/${user.uid}`);
                if (response.status === 200) {
                    setUserOrders(response.data);

                    // Organize orders by restaurant
                    const restaurantOrders = {};
                    response.data.forEach(order => {
                        const restaurantName = order.restaurant || "Unknown Restaurant"; // Handle cases where restaurant might be missing
                        if (!restaurantOrders[restaurantName]) {
                            restaurantOrders[restaurantName] = [];
                        }
                        restaurantOrders[restaurantName].push(order);
                    });
                    setOrdersByRestaurant(restaurantOrders); // Update state


                } else {
                    console.error("Error fetching User Orders", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
            }
        };

        fetchUserOrders();
    }, [user, navigate]);


    const restaurantNames = ["Don's at Walb", "Java Spot", "Einstein Bros.", "Bon Bon's Coffee"]; // List of restaurants
    const toggleRestaurant = (restaurantName) => {
        setExpandedRestaurant((prev) => (prev === restaurantName ? null : restaurantName));
      };
      

    return (
        <div className="track-order-container">
        <h2>Track Your Orders</h2>

        <div className="filters">
            {restaurantNames.map((restaurantName) => (
            <div className="filter-section" key={restaurantName}>
                <div
                className={`filter-header ${expandedRestaurant === restaurantName ? 'expanded' : ''}`}
                onClick={() => toggleRestaurant(restaurantName)}
                >
                <span>{restaurantName}</span>
                <span className="icon">{expandedRestaurant === restaurantName ? '▼' : '▶'}</span>
                </div>
                <div
                className={`filter-content ${expandedRestaurant === restaurantName ? 'expanded' : ''}`}
                >
                {ordersByRestaurant[restaurantName] && ordersByRestaurant[restaurantName].length > 0 ? (
                    <ul>
                    {ordersByRestaurant[restaurantName].map((order) => (
                        <li key={order.orderId}>
                        <p>Order ID: {order.orderId}</p>
                        <p>Status: {order.status}</p>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="empty-message">No orders placed at this restaurant yet.</p>
                )}
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};


export default TrackOrder;

