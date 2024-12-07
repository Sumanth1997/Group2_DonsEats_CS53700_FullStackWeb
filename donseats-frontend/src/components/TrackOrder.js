import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TrackOrder.css';  // Create this CSS file
import { AuthContext } from '../services/AuthContext'; // Import AuthContext

const TrackOrder = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user) { // Check if user is logged in
                navigate('/login'); // Redirect to login if not logged in
                return;
            }
            try {

                const response = await axios.get(`http://localhost:5001/api/bagelsOrder/user/${user.uid}`); // New endpoint (see server.js)


                if(response.status === 200){
                    setUserOrders(response.data);

                }
                else {
                    console.error("Error fetching User Orders", response.status, response.statusText);


                }


            } catch (error) {
                console.error("Error fetching user orders:", error);


            }
        };

        fetchUserOrders();
    }, [user, navigate]); // Add navigate to dependency array


    return (
        <div className="track-order-container">
            <h2>Track Your Orders</h2>

            {userOrders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <ul>
                    {userOrders.map((order) => (
                        <li key={order.orderId}>
                            <h3>Order ID: {order.orderId}</h3>
                            <p>Status: {order.status}</p>
                           {/* Add more details here if needed  */}
                            {/* Example */}
                            <p>
                                Items:
                                {Object.entries(order.items).map(([itemName, quantity]) => (
                                    <span key={itemName}> {itemName} x {quantity} </span>
                                ))}
                            </p>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TrackOrder;

