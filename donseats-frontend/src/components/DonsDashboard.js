// Dashboard.js (new component)
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { AuthContext } from "../services/AuthContext";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";

// const db = getFirestore(app);
// const storage = getStorage(app);

const DonsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({}); // Store order statuses

  const [imageUpload, setImageUpload] = useState(null);
  const categories = ['Epic Eats', 'Mozzie\'s', 'Deliss', 'Central Grill Co.','Saborijos','Weekly Grill Specials'];
  const subcategories = {
    "Epic Eats": ["Meal Swipe Deals", "À La Carte"],
    "Mozzies\'s": ["Pizza Deals","Pasta Deals","À La Carte"],
    "Deliss": ["Meal Swipe Deals","À La Carte"],
    "Central Grill Co.": ["Meal Swipe Deals","À La Carte","Sides & Extras"],
    "Saborijos":["Meal Swipe Deals","À La Carte Sides"],
    "Weekly Grill Specials":["Monday","Tuesday","Wednesday","Thursday","Friday"],
  };

  const [newMenuItem, setNewMenuItem] = useState({
    category: categories[0],
    subcategory: subcategories[categories[0]][0],
    title: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [menuItems, setMenuItems] = useState({});
  const [reviews, setReviews] = useState([]);
  const [dishRequests, setDishRequests] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dons/menuItems`); // Replace with your backend endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddMenuItem = async () => {
    try {
      if (!imageUpload) {
        alert("Please upload an image");
        return;
      }

      const formData = new FormData();
      formData.append("image", imageUpload); // Append the image file
      formData.append("category", newMenuItem.category); //Append other form data
      formData.append("subcategory", newMenuItem.subcategory);
      formData.append("title", newMenuItem.title);
      formData.append("price", newMenuItem.price);
      formData.append("description", newMenuItem.description);

      const response = await axios.post(
        `${API_URL}/api/dons/addMenuItem`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      if (response.status !== 200) {
        // Explicit status check
        throw new Error(
          `Server returned an error: ${response.status} - ${response.statusText}`
        );
      }

      // ... handle success
      alert("Item added to Menu successfully");
      // ... reset form, etc.
      setNewMenuItem({
        category: categories[0],
        subcategory: subcategories[categories[0]][0],
        title: "",
        price: "",
        description: "",
        imageUrl: "",
      });
      setImageUpload(null);
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert(
        "Error adding menu item: " + (error.response?.data || error.message)
      );
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/api/dons/deleteMenuItem/${itemId}`); // Send DELETE to the server
      // Update local state (remove the deleted item)
      const updatedMenuItems = { ...menuItems };
      delete updatedMenuItems[itemId]; // Assuming itemId becomes the key
      setMenuItems(updatedMenuItems);
      alert("Menu Item deleted successfully");
    } catch (error) {
      // ... handle error
    }
  };

  const handleUpdateMenuItem = async (itemId, updatedData) => {
    try {
      // Ensure title and price are provided
      if (!updatedData.title || !updatedData.price) {
        return alert("Title and price are required for updating.");
      }

      const dataToUpdate = {
        title: updatedData.title, // Use updated title if available, otherwise use the original itemId
        price: updatedData.price,
      };

      const response = await axios.put(
        `${API_URL}/api/dons/updateMenuItem`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error updating menu item: ${response.status} ${response.statusText}`
        );
      }

      const updatedItem = response.data;

      setMenuItems((prevMenuItems) => {
        const updatedMenuItems = { ...prevMenuItems };
        for (const category in updatedMenuItems) {
          for (const subcategory in updatedMenuItems[category]) {
            updatedMenuItems[category][subcategory] = updatedMenuItems[
              category
            ][subcategory].map((item) =>
              item.title === itemId ? updatedItem : item
            );
          }
        }
        return updatedMenuItems;
      });

      alert("Menu item updated successfully");
    } catch (error) {
      console.error("Error updating menu item:", error);
      alert("Error updating menu item: " + error.message);
    }
  };
  useEffect(() => {
    const fetchDishRequests = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/dons/dishRequests`
        ); // Use axios.get()
        setDishRequests(response.data);
      } catch (error) {
        console.error("Error fetching dish requests:", error);
        // ... handle error (e.g., set an error state) ...
      }
    };

    fetchDishRequests();
  }, []);
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/feedback/dons`
        ); // Fetch feedback for the specific restaurant
        setFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        // ... handle error ...
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dons/donsOrders`); // Replace with your actual endpoint

        // Check response status
        if (response.status === 200) {
          // Same logic to set pending orders and statuses as Dashboard.js
          const ordersWithInitialStatus = response.data.map((order) => ({
            ...order,
            status: order.status || "New", // Set initial status if not present
          }));

          setPendingOrders(ordersWithInitialStatus);
          const initialStatuses = {};
          ordersWithInitialStatus.forEach((order) => {
            initialStatuses[order.orderId] = order.status;
          });
          setOrderStatuses(initialStatuses);
        } else {
          console.error("Error fetching Dons orders:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    fetchPendingOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/dons/donsOrders/${orderId}`, // Make sure this is your dons order update endpoint
        { status: newStatus }
      );

      // Update the order status in the local state:
      setOrderStatuses((prevStatuses) => ({
        ...prevStatuses,
        [orderId]: newStatus,
      }));

      setPendingOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status: " + error.message);
    }
  };

  return (
    <div className="dashboard">
      {/* Pending Orders Section */}
      <section className="orders-section">
        <h2>Pending Orders</h2>
        <ul>
          {pendingOrders.map((order) => (
            <li key={order.orderId}>
              <p>Order ID: {order.orderId}</p>

              <p>
                Items:
                {Object.entries(order.items).map(([itemName, quantity]) => (
                  <span key={itemName}>
                    {itemName} x {quantity}
                    <br />
                  </span>
                ))}
              </p>

              {/* ... other order details ... */}

              <div>
                <p>Current Status: {orderStatuses[order.orderId] || "New"}</p>{" "}
                {/* Display status, default to 'New' */}
                <select
                  value={orderStatuses[order.orderId] || "New"}
                  onChange={(e) =>
                    handleUpdateOrderStatus(order.orderId, e.target.value)
                  }
                >
                  <option value="New">New</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Ready for Pickup">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Menu Management Section */}
      <section className="menu-management">
        <h2>Menu Management</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMenuItem();
          }}
        >
          <select
            value={newMenuItem.category}
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, category: e.target.value })
            }
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {/* Subcategory selection (make this dynamic based on the chosen category) */}
          <select
            value={newMenuItem.subcategory}
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, subcategory: e.target.value })
            }
            required
          >
            {subcategories[newMenuItem.category].map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Title"
            value={newMenuItem.title}
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, title: e.target.value })
            }
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={newMenuItem.price}
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, price: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={newMenuItem.description}
            onChange={(e) =>
              setNewMenuItem({ ...newMenuItem, description: e.target.value })
            }
            required
          />

          {/* Image upload */}
          <input
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
            required
          />

          <button type="submit">Add Item</button>
        </form>
        <div>
          {" "}
          {/* Container for list of menu items and delete buttons */}
          <h3>Current Menu Items</h3>
          {Object.entries(menuItems).map(([category, subcategories]) => (
            <div key={category}>
              <h4>{category}</h4>
              {Object.entries(subcategories).map(([subcategory, items]) => (
                <div key={subcategory}>
                  <h5>{subcategory}</h5>
                  <ul>
                    {items.map((item) => (
                      <li key={item.title}>
                        {item.title} - ${item.price}{" "}
                        <button
                          onClick={() => handleDeleteMenuItem(item.title)}
                        >
                          Delete
                        </button>
                        {/* Form for editing item */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateMenuItem(item.title, {
                              // Update fields as needed
                              title: e.target.updatedTitle.value,
                              price: e.target.updatedPrice.value,
                            });
                          }}
                        >
                          <input
                            type="text"
                            name="updatedTitle"
                            placeholder="Updated Title"
                            defaultValue={item.title}
                          />
                          <input
                            type="text"
                            name="updatedPrice"
                            placeholder="Updated Price"
                            defaultValue={item.price}
                          />
                          <button type="submit">Update</button>
                        </form>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="dish-requests-section">
        {" "}
        {/* Separate section */}
        <h2>Dish Requests</h2>
        <ul>
          {dishRequests.map((request) => (
            <li key={request.id}>
              <p>{request.dishName}</p>
              {/* <p>Requested By: {request.userId}</p> Display User ID */}
              {/* <p>Requested At: {request.requestTimestamp ? request.requestTimestamp.toDate().toLocaleString() : 'N/A'}</p> Format timestamp */}
            </li>
          ))}
        </ul>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>Feedback</h2>
        <ul>
          {" "}
          {/* Use a list to display feedback */}
          {feedback.map((feedbackItem) => (
            <li key={feedbackItem.id}>
              <p>{feedbackItem.feedback}</p>
              {/* Display other feedback details (user ID, timestamp, etc.) as needed */}
              <p>Feedback By: {feedbackItem.username}</p>
              {/* <p>
                          Feedback At:{' '}
                          {feedbackItem.timestamp
                              ? feedbackItem.timestamp.toDate().toLocaleString()
                              : 'N/A'}
                      </p> */}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DonsDashboard;
