// Dashboard.js (new component)
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { AuthContext } from '../services/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

// const db = getFirestore(app);
// const storage = getStorage(app);

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [pendingOrders, setPendingOrders] = useState([]);
    const [imageUpload, setImageUpload] = useState(null);
    const categories = ['Egg Sandwiches', 'Signature Lunch', 'Beverages', 'Espresso'];
    const subcategories = {
        'Egg Sandwiches': ['Classics', 'Signature', 'Egg white', 'Make it a meal', 'Customize it'],
        'Signature Lunch': ['Classic', 'Hot & Toasty', 'Pizza Bagel', 'Deli Select'],
        'Beverages': ['Classic', 'Flavored', 'Cold Brew Shakes', 'Strawberry Banana Smoothie', 'Brewed Coffee'],
        'Espresso': ['Hot', 'Hot Chocolate', 'Iced'],
    };

    const [newMenuItem, setNewMenuItem] = useState({
        category: categories[0],
        subcategory: subcategories[categories[0]][0],
        title: '',
        price: '',
        description: '',
        imageUrl: '',
    });

    const [menuItems, setMenuItems] = useState({});
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        

        const fetchMenuItems = async () => {
          try {
              const response = await fetch('http://localhost:5001/api/menuItems'); // Replace with your backend endpoint
              if (!response.ok) {
                  throw new Error('Network response was not ok');
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
              alert('Please upload an image');
              return;
          }
  
          const formData = new FormData();
          formData.append('image', imageUpload);  // Append the image file
          formData.append('category', newMenuItem.category);  //Append other form data
          formData.append('subcategory', newMenuItem.subcategory);
          formData.append('title', newMenuItem.title);
          formData.append('price', newMenuItem.price);
          formData.append('description', newMenuItem.description);
  
  
          const response = await axios.post('http://localhost:5001/api/addMenuItem', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data' // Important for file uploads
              },
          });
  
          if (response.status !== 200) {  // Explicit status check
              throw new Error(`Server returned an error: ${response.status} - ${response.statusText}`);
          }
  
  
  
          // ... handle success
          alert('Item added to Menu successfully');
          // ... reset form, etc.
          setNewMenuItem({
            category: categories[0],
            subcategory: subcategories[categories[0]][0],
            title: '',
            price: '',
            description: '',
            imageUrl: '',
          });
          setImageUpload(null);
  
      } catch (error) {
          console.error('Error adding menu item:', error);
          alert("Error adding menu item: " + (error.response?.data || error.message));
  
      }
  };

  const handleDeleteMenuItem = async (itemId) => {
    try {
        await axios.delete(`/api/deleteMenuItem/${itemId}`); // Send DELETE to the server
        // Update local state (remove the deleted item)
        const updatedMenuItems = { ...menuItems };
        delete updatedMenuItems[itemId]; // Assuming itemId becomes the key
        setMenuItems(updatedMenuItems);
        alert('Menu Item deleted successfully');
    } catch (error) {
        // ... handle error
    }
};


const handleUpdateMenuItem = async (itemId, updatedData) => {
  try {
      // Correct the API endpoint here to match your backend route.  `/api/updateMenuItem/${itemId}`
      const response = await axios.put(`/api/updateMenuItem/${itemId}`, updatedData);

      if (!response.ok) {
          throw new Error(`Error updating menu item: ${response.status} ${response.statusText}`);
      }

      // Update local state using the returned data or updatedData
      const updatedItem = response.data; // Use the server-response

      setMenuItems(prevMenuItems => ({
          ...prevMenuItems,
          [updatedItem.category]: {
            ...prevMenuItems[updatedItem.category],
            [updatedItem.subcategory]: prevMenuItems[updatedItem.category][updatedItem.subcategory].map(item =>
                item.title === itemId ? updatedItem : item  // Replace existing item in state with updated item
              )
          }
        }));
      alert('Menu item updated successfully');



  } catch (error) {
      console.error("Error updating menu item:", error);
      alert("Error updating menu item: " + error.message);

  }
};



    return (
        <div className="dashboard">
            {/* Pending Orders Section */}
            <section className="orders-section"> {/* Added a className here */}
            <h2>Pending Orders</h2>
            <ul>
                {pendingOrders.map((order) => (
                    <li key={order.id}>
                       {/* Display order details */}
                       <p>Order ID: {order.id}</p>
                       <p>Items: {JSON.stringify(order.cartItems)}</p> {/* Assuming cartItems is stored directly in the order */}
                       {/* Display other details like order time, etc. */}
                       <p>Customer: {order.orderBy}</p>
                       <button onClick={() => navigate(`/order/${order.id}`)}>View Details</button> {/* Navigate to specific order */}

                    </li>
                ))}
            </ul>
            </section>


            {/* Menu Management Section */}
            <section className="menu-management">
                <h2>Menu Management</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleAddMenuItem(); }}>
                    <select value={newMenuItem.category} onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })} required>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {/* Subcategory selection (make this dynamic based on the chosen category) */}
                    <select
          value={newMenuItem.subcategory}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, subcategory: e.target.value })}
          required
        >
          {subcategories[newMenuItem.category].map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>

                    <input type="text" placeholder="Title" value={newMenuItem.title} onChange={(e) => setNewMenuItem({ ...newMenuItem, title: e.target.value })} required />
                    <input type="number" step="0.01" placeholder="Price" value={newMenuItem.price} onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })} required />
                    <textarea placeholder="Description" value={newMenuItem.description} onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })} required />

                    {/* Image upload */}
                    <input type="file" onChange={(e) => setImageUpload(e.target.files[0])} required />

                    <button type="submit">Add Item</button>
                </form>
                <div> {/* Container for list of menu items and delete buttons */}
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
                                {item.title} - ${item.price}{' '}
                                <button onClick={() => handleDeleteMenuItem(item.title)}>
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
                                <input type="text" name="updatedTitle" placeholder="Updated Title" defaultValue={item.title} />
                                <input type="text" name="updatedPrice" placeholder="Updated Price" defaultValue={item.price} />
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


            {/* Reviews Section */}
            <section className="reviews-section">
                <h2>Reviews</h2>
                {/* ... your logic to display reviews */}
            </section>
        </div>
    );
};

export default Dashboard;




