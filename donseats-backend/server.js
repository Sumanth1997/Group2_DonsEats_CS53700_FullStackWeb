const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const admin = require('firebase-admin');



const serviceAccount = require('./serviceAccountKey.json'); // Correct path is crucial
admin.initializeApp({  // Use admin.initializeApp
  credential: admin.credential.cert(serviceAccount) // Use admin.credential.cert
});

const db = admin.firestore();


app.get('/api/menuItems', async (req, res) => { // Async route handler
  console.log("Received request for /api/menuItems");
  try {
    const menuItemsCollection = db.collection('menuItems'); // Use db directly
    const menuItemsSnapshot = await menuItemsCollection.get(); // Use get() on collection

    const menuItemsData = [];
    menuItemsSnapshot.forEach((doc) => {
      menuItemsData.push({ id: doc.id, ...doc.data() }); 
    });

    const formattedData = {}; 
    menuItemsData.forEach(item => {
        if (!formattedData[item.category]) {
            formattedData[item.category] = {};
        }
        if (!formattedData[item.category][item.subcategory]) {
            formattedData[item.category][item.subcategory] = [];
        }
        formattedData[item.category][item.subcategory].push(item);
    });

    res.json(formattedData);

  } catch (error) {
    console.error("Error fetching menu items: ", error);
    res.status(500).send("Error fetching data"); // Send error to the client
  }
});


// ... rest of server.js


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
