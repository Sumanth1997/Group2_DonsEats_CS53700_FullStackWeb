// Dashboard.js (new component)
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Create this CSS file
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import app from '../services/firebaseConfig';
import { AuthContext } from '../services/AuthContext'; // Import AuthContext


const db = getFirestore(app);

const Dashboard = () => {
    const navigate = useNavigate();

    const { user } = useContext(AuthContext); //Get user from Context

    const [pendingOrders, setPendingOrders] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({
        category: '', // Add category
        subcategory: '', // Add subcategory
        title: '',
        price: '',
        description: '',
        imageUrl: '',
    });
    const [menuItems, setMenuItems] = useState({});
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            // ... your logic to fetch pending orders from Firestore (or your backend)
            try {
              const ordersCollection = collection(db, 'orders'); // Assuming 'orders' is your collection
              const querySnapshot = await getDocs(ordersCollection);
      
              const ordersData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
      
              //Filter to display only Pending Orders
              setPendingOrders(ordersData.filter((order) => order.status === 'pending'));
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();

        const fetchReviews = async () => {
            // ... your logic to fetch reviews from Firestore (or your backend)
            try {
              // ... implementation ...
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();

        const fetchMenuItems = async () => {
          try {
              const response = await fetch('/api/menuItems'); // Replace with your backend endpoint
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
            const docRef = await addDoc(collection(db, 'menuItems'), newMenuItem);
            // ... handle success (e.g., update menuItems state, clear form)
            setNewMenuItem({   // Clear the form after adding item
              category: '',
              subcategory: '',
              title: '',
              price: '',
              description: '',
              imageUrl: '',

           });
           alert('Item added to Menu successfully');

        } catch (error) {
            console.error('Error adding menu item:', error);
             // ... error handling
        }
    };

    const handleDeleteMenuItem = async (itemId) => { // itemId parameter
      try {
        // itemId should be path to the specific document in menuItems collection you want to delete
          await deleteDoc(doc(db, "menuItems", itemId)); //Correct this doc
          // Update the local state after deleting from Firestore.
          setMenuItems((prevMenuItems) => {
             const updatedMenuItems = { ...prevMenuItems }; // Create a copy of menuItems
             delete updatedMenuItems[itemId]; // Delete the item from copy using "title"
             return updatedMenuItems;
          });

          alert('Menu Item deleted successfully'); // Show success message or handle in a better way if required.
      } catch (error) {
          console.error("Error deleting menu item:", error);
           // Error handling, e.g., show error message to user
      }
  };


  const handleUpdateMenuItem = async (itemId, updatedData) => {
    try {
        await updateDoc(doc(db, "menuItems", itemId), updatedData);
         // Update the local state after updating in Firestore.
         setMenuItems((prevMenuItems) => ({
            ...prevMenuItems,
            [itemId]: { ...prevMenuItems[itemId], ...updatedData }, //Merge updated data to the existing item
         }));
        console.log("Menu item updated successfully");
        // ... optionally, clear the update form or display a success message
    } catch (error) {
        console.error("Error updating menu item:", error);
        // ... error handling
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
                    {/* Input fields for category, subcategory, title, price, description, imageUrl */}
                    <input type="text" placeholder="Category" value={newMenuItem.category} onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })} required />
                    <input type="text" placeholder="Subcategory" value={newMenuItem.subcategory} onChange={(e) => setNewMenuItem({ ...newMenuItem, subcategory: e.target.value })} required />
                    {/* ... other input fields */}
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





