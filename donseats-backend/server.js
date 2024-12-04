const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const admin = require('firebase-admin');
const multer = require('multer');  // For handling multipart/form-data
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase-admin/storage'); // Import from Firebase Admin SDK
app.use(express.json()); 
const serviceAccount = require('./serviceAccountKey.json'); // Correct path is crucial

admin.initializeApp({  // Use admin.initializeApp
  credential: admin.credential.cert(serviceAccount), // Use admin.credential.cert
  storageBucket:"gs://donseats-23f67.firebasestorage.app",
});

const db = admin.firestore();
const storage = getStorage(); // Initialize Storage *after* initializing the app.


const upload = multer({ storage: multer.memoryStorage() });

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


app.post('/api/addMenuItem', upload.single('image'), async (req, res) => {
  try {
    const { category, subcategory, title, price, description } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).send("No image file uploaded");
    }

    // Upload the image to Firebase Storage
    const bucket = storage.bucket(); // Get the default bucket
    const file = bucket.file(`menuImages/${imageFile.originalname}`); // Create a reference to the file

    const stream = file.createWriteStream({
      metadata: {
        contentType: imageFile.mimetype,
      },
    });

    stream.end(imageFile.buffer);

    stream.on('finish', async () => {
      // Get the public URL of the uploaded file
      const imageUrl = await getDownloadURL(file); 
      // Add menu item details to Firestore
      const newMenuItemDocumentRef = await db.collection('menuItems').add({
        category,
        subcategory,
        title,
        price: price + " USD",
        description,
        imageUrl, // Save the image URL in Firestore
      });

      console.log("Menu item added successfully with id:", newMenuItemDocumentRef.id);

      res.status(200).json({ success: true, id: newMenuItemDocumentRef.id });
    });

    stream.on('error', (error) => {
      console.error("Error uploading image:", error);
      res.status(500).send("Error uploading image");
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).send(error.message);
  }
});

app.get('/api/menuItems/updates', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const unsubscribe = db.collection('menuItems').onSnapshot((snapshot) => {
      const changes = snapshot.docChanges();


      if (changes.length > 0) {
          const menuItemsData = [];
          snapshot.forEach(doc => {
              menuItemsData.push({ id: doc.id, ...doc.data()});
          });

          const formattedData = {}; // Format data as needed by your frontend
              menuItemsData.forEach(item => {
              // Existing formatting logic...
              });

          res.write(`data: ${JSON.stringify(formattedData)}\n\n`); // Send formatted data
      }

  });


  req.on('close', () => {
      unsubscribe(); // Stop listening when client disconnects
      console.log('Client disconnected from SSE');
    });
});

app.delete('/api/deleteMenuItem/:title', async (req, res) => {
  try {
    const title = req.params.title; // Get the item title to delete

    // Query for the document based on the title
    const snapshot = await db.collection('menuItems').where('title', '==', title).get();


    if (snapshot.empty) {
      return res.status(404).send('Menu item not found');
    }

    // There might be multiple documents with the same title, delete the first one for now. In real-world scenario, we should use unique id for items
    const docToDelete = snapshot.docs[0];


    // Delete the document
    await docToDelete.ref.delete();

    console.log('Menu item deleted successfully:', title);

    res.status(200).send('Menu item deleted successfully');


  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).send(error.message); // Send the error message to the client
  }
});



app.put('/api/updateMenuItem', async (req, res) => {
  try {
    const { title, price } = req.body;

    // Ensure title and price are provided (These are your key fields for lookup)
    if (!title || !price) {
      return res.status(400).send("Title and price are required for updating.");
    }

    // Query Firestore for the document based on title (primary key)
    const snapshot = await db.collection('menuItems').where('title', '==', title).get();

    if (snapshot.empty) {
      return res.status(404).send("Menu item not found with the given title.");
    }

    // Get the first matching document (you should ideally have unique titles)
    const docToUpdate = snapshot.docs[0];

    // Create the update object; only include price if it's being changed
    const updates = {
        price: price,  // Update the price
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
});




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
