const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { getStorage, getDownloadURL } = require("firebase-admin/storage");


// Initialize Firestore and Storage (Make sure admin is initialized in your main server file)
const admin = require('firebase-admin');
const db = admin.firestore();
const storage = getStorage();



router.get("/menuItems", async (req, res) => {
  console.log("Received request for /api/donsMenuItems");
    try {
      const menuItemsCollection = db.collection("donsMenuItems");
      const menuItemsSnapshot = await menuItemsCollection.get();
  
      const menuItemsData = [];
      menuItemsSnapshot.forEach((doc) => {
        menuItemsData.push({ id: doc.id, ...doc.data() });
      });
  
      const formattedData = {};
      menuItemsData.forEach((item) => {
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
      console.error("Error fetching Dons menu items: ", error);
      res.status(500).send("Error fetching data");
    }
});



router.post("/addMenuItem", upload.single("image"), async (req, res) => {
  try {
    const { category, subcategory, title, price, description } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).send("No image file uploaded");
    }

    // Upload the image to Firebase Storage
    const bucket = storage.bucket(); // Get the default bucket
    const file = bucket.file(`donsMenuImages/${imageFile.originalname}`); // Create a reference to the file

    const stream = file.createWriteStream({
      metadata: {
        contentType: imageFile.mimetype,
      },
    });

    stream.end(imageFile.buffer);

    stream.on("finish", async () => {
      // Get the public URL of the uploaded file
      const imageUrl = await getDownloadURL(file);
      // Add menu item details to Firestore
      const newMenuItemDocumentRef = await db.collection("donsMenuItems").add({
        category,
        subcategory,
        title,
        price: price + " USD",
        description,
        imageUrl, // Save the image URL in Firestore
      });

      console.log(
        "Menu item added successfully with id:",
        newMenuItemDocumentRef.id
      );

      res.status(200).json({ success: true, id: newMenuItemDocumentRef.id });
    });

    stream.on("error", (error) => {
      console.error("Error uploading image:", error);
      res.status(500).send("Error uploading image");
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).send(error.message);
  }
});


router.get("/menuItems/updates", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const unsubscribe = db.collection("donsMenuItems").onSnapshot((snapshot) => {
    const changes = snapshot.docChanges();

    if (changes.length > 0) {
      const menuItemsData = [];
      snapshot.forEach((doc) => {
        menuItemsData.push({ id: doc.id, ...doc.data() });
      });

      const formattedData = {}; // Format data as needed by your frontend
      menuItemsData.forEach((item) => {
        // Existing formatting logic...
      });

      res.write(`data: ${JSON.stringify(formattedData)}\n\n`); // Send formatted data
    }
  });

  req.on("close", () => {
    unsubscribe(); // Stop listening when client disconnects
    console.log("Client disconnected from SSE");
  });
});


router.delete("/deleteMenuItem/:title", async (req, res) => {  //  Route to delete a Don's menu item
  try {
    const title = req.params.title; // Get the item title to delete

    // Query for the document based on the title
    const snapshot = await db
      .collection("donsMenuItems")
      .where("title", "==", title)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Menu item not found");
    }

    // There might be multiple documents with the same title, delete the first one for now. In real-world scenario, we should use unique id for items
    const docToDelete = snapshot.docs[0];

    // Delete the document
    await docToDelete.ref.delete();

    console.log("Menu item deleted successfully:", title);

    res.status(200).send("Menu item deleted successfully");
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).send(error.message); // Send the error message to the client
  }
});


router.put("/updateMenuItem", async (req, res) => {
  try {
    const { title, price } = req.body;

    // Ensure title and price are provided (These are your key fields for lookup)
    if (!title || !price) {
      return res.status(400).send("Title and price are required for updating.");
    }

    // Query Firestore for the document based on title (primary key)
    const snapshot = await db
      .collection("donsMenuItems")
      .where("title", "==", title)
      .get();

    if (snapshot.empty) {
      return res.status(404).send("Menu item not found with the given title.");
    }

    // Get the first matching document (you should ideally have unique titles)
    const docToUpdate = snapshot.docs[0];

    // Create the update object; only include price if it's being changed
    const updates = {
      price: price, // Update the price
    };

    // Update the document
    await docToUpdate.ref.update(updates);

    // Fetch the updated document to return in the response (best practice)
    const updatedDoc = await docToUpdate.ref.get();
    const updatedMenuItem = { id: updatedDoc.id, ...updatedDoc.data() };

    console.log("Menu item updated successfully:", updatedMenuItem);
    res.status(200).json(updatedMenuItem); // Send back the updated object
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).send(error.message);
  }
})

router.post("/requestNewDish", async (req, res) => {
  try {
    const { dishName, userId } = req.body; // Get dishName and userId from request body

    if (!dishName || !userId) {
      // Validation: Check for required fields
      return res
        .status(400)
        .json({ error: "Dish name and user ID are required." });
    }

    // Add the request to Firestore
    const requestDocRef = await db.collection("dons").add({
      dishName: dishName, // The requested dish name
      userId: userId, // The UID of the user making the request
      requestTimestamp: admin.firestore.FieldValue.serverTimestamp(), // Add a timestamp
    });

    console.log("New dish request added with ID:", requestDocRef.id);
    res
      .status(201)
      .json({
        message: "Dish request submitted successfully",
        requestId: requestDocRef.id,
      });
  } catch (error) {
    console.error("Error adding dish request:", error);
    res.status(500).json({ error: "Failed to submit dish request" }); // Send error to client
  }
});

router.get("/dishRequests", async (req, res) => {
    // New route
  try {
    const einsteinBagelsRef = db.collection("dons");
    const snapshot = await einsteinBagelsRef.get();

    if (snapshot.empty) {
      return res.status(200).json([]); // Return empty array if no requests exist
    }

    const dishRequests = [];
    snapshot.forEach((doc) => {
      dishRequests.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(dishRequests); // Send dish requests to the client
  } catch (error) {
    console.error("Error fetching dish requests:", error);
    res.status(500).json({ error: "Failed to fetch dish requests" });
  }
});


router.post('/donsOrder', async (req, res) => {
  try {
    const { userId, items, status, orderPickupTime } = req.body;

    // Generate a unique order ID (you can use various methods like UUIDs)
    const orderId = generateUniqueId(); //  Implement this function (see below)

    const orderDocRef = await db.collection('donsOrder').doc(orderId).set({ // Use doc(orderId) to set ID. Use set instead of add to manually set the doc ID
      orderId, // Store orderId in document
      userId,
      items,
      status,
      orderPickupTime,
      orderTime: admin.firestore.FieldValue.serverTimestamp(),
    });



    console.log('Order created with ID:', orderId);
    res.status(201).json({ message: 'Order placed successfully', orderId: orderId }); // Return orderId in response

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

function generateUniqueId() {
  // Example using a timestamp + random number (basic example, improve for production)
  const timestamp = Date.now().toString();
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4-digit random number

  return `${timestamp}-${randomNumber}`;


  // Or Consider using UUID library for better uniqueness: npm install uuid
 // Example:
  // const { v4: uuidv4 } = require('uuid');
  // return uuidv4();
}

router.get('/donsOrder', async (req, res) => {
  try {
      const bagelsOrderRef = db.collection('donsOrder');
      const snapshot = await bagelsOrderRef.get();


      if (snapshot.empty) {
          return res.status(200).json([]); // Return empty array if no orders

      }

      const orders = [];
      snapshot.forEach(doc => {

          orders.push({ orderId: doc.id, ...doc.data() }); // Include the document ID as orderId



      });

      res.status(200).json(orders);
  } catch (error) {

      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });

  }

});


router.put('/donsOrder/:orderId', async (req, res) => {  // New route for updating order status
  try {
      const orderId = req.params.orderId;
      const { status } = req.body;

      const orderRef = db.collection('donsOrder').doc(orderId);
      const doc = await orderRef.get();


      if (!doc.exists) {
          return res.status(404).json({ error: 'Order not found' });


      }

      // Update the order document with the new status

      await orderRef.update({ status });



      console.log(`Order ${orderId} updated to status: ${status}`);
      res.json({ message: 'Order status updated successfully' });
  } catch (error) {

      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Failed to update order' }); // More informative error response
  }

});


router.get('/donsOrder/user/:userId', async (req, res) => {  // New endpoint to fetch orders by User Id
  try {
      const userId = req.params.userId;  // Get userId from the URL
      const bagelsOrderRef = db.collection('donsOrder').where('userId', '==', userId); // Filter by userId
      const snapshot = await bagelsOrderRef.get();

      if (snapshot.empty) {
          return res.status(200).json([]); // Or 404 if you prefer to handle as "not found"
      }


      const orders = [];
      snapshot.forEach(doc => {
          orders.push({ orderId: doc.id, ...doc.data() });
      });


      res.status(200).json(orders);

  } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch user orders' }); // Provide details about why it failed.
  }
});

router.get('/donsMenuItems', async (req, res) => {
  try {
    const donsMenuItemsRef = db.collection('donsMenuItems'); // Assuming you have a 'donsMenuItems' collection in Firestore. You might want to rename this collection.
    const snapshot = await donsMenuItemsRef.get();

    if (snapshot.empty) {
        return res.status(404).json({error: 'No Bon dons Menu Items found'}); // Send a 404 if no menu items are found. You can handle it as a 200 if you want to return an empty array.
    }

    // Convert Firestore data to a format suitable for the frontend
      const donsMenuItemsData = [];
      snapshot.forEach((doc) => {
        donsMenuItemsData.push({ id: doc.id, ...doc.data() });
      });

      const formattedData = {}; //  Format the data like Menu.js expects
      donsMenuItemsData.forEach((item) => {
        if (!formattedData[item.category]) {
          formattedData[item.category] = {};
        }
        if (!formattedData[item.category][item.subcategory]) {
          formattedData[item.category][item.subcategory] = [];
        }
        formattedData[item.category][item.subcategory].push(item);
      });


    res.status(200).json(formattedData);


  } catch (error) {
    console.error('Error fetching dons menu items:', error);
    res.status(500).json({ error: 'Failed to fetch dons menu items' }); // Send a 500 and a more informative error message
  }

});




module.exports = router;

