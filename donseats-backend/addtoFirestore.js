const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ... other config if needed
});

const db = admin.firestore();
const bonsMenuItems = {
    'Coffee & Espresso': {
        'Iced Espresso': [
            { title: 'Iced Cappuccino', price: '3.59 USD', imageUrl: '/Images/Iced_Cappuccino.png', description: 'A chilled espresso drink with smooth milk foam.' },
            { title: 'Cake Walk', price: '3.64 USD', imageUrl: '/Images/Cake Walk.png', description: 'Salted caramel and tiramisu flavor espresso.' },
            { title: 'Irish Dream', price: '3.64 USD', imageUrl: '/Images/Irish Dream.png',  description: 'A blend of Irish cream and vanilla flavors.' },
            { title: 'Mac Latte', price: '3.99 USD', imageUrl: '/Images/Mac Latte.png',  description: 'A creamy latte with a hint of caramel.' },
        ],
        'Hot Chocolates': [
            { title: 'Zebra', price: '3.39 USD', imageUrl: '/Images/Zebra.png',  description: 'A mix of dark and white hot chocolate.' },
            { title: 'White', price: '3.39 USD', imageUrl: '/Images/White.png',  description: 'Classic hot chocolate made with white chocolate.' },
            { title: 'Truffle', price: '3.94 USD', imageUrl: '/Images/Truffle.png',  description: 'Buttery pecan and salted caramel hot chocolate.' },
        ]
    },
    'Refreshers': {
        'Specials': [
            { title: 'Strawberry Acai', price: '2.99 USD', imageUrl: '/Images/Strawberry Acai.png',  description: 'Refreshing strawberry acai blend.' },
            { title: 'Watermelon Mint', price: '2.99 USD', imageUrl: '/Images/Watermelon Mint.png',  description: 'A cool blend of watermelon and mint.' },
            { title: 'Strawberry Mac', price: '3.99 USD', imageUrl: '/Images/Strawberry Mac.png',  description: 'Strawberry with macadamia milk.' },
        ]
    },
    'Smoothies': {
        'Fruit Blends': [
            { title: 'Strawberry + Banana', price: '4.49 USD', imageUrl: '/Images/Strawberry + Banana.png',  description: 'A blend of strawberry and banana.' },
            { title: 'Peach + Mango', price: '4.49 USD', imageUrl: '/Images/Peach + Mango.png',  description: 'A tropical mix of peach and mango.' },
            { title: 'Strawberry Lemonade', price: '4.49 USD', imageUrl: '/Images/Strawberry Lemonade.png',  description: 'Strawberry with a splash of lemonade.' }
        ]
    },
    'Shakes': {
        'Classic Shakes': [
            { title: 'Shoaff', price: '4.85 USD', imageUrl: '/Images/Shoaff.png',  description: 'Bon Bon’s classic chocolate shake.' },
            { title: 'Peanut Butter Blitz', price: '4.85 USD', imageUrl: '/Images/Peanut Butter Blitz.png',  description: 'Peanut butter and chocolate shake.' },
            { title: 'Chai Shake', price: '4.85 USD', imageUrl: '/Images/Chai Shake.png',  description: 'A spiced chai shake with milk and ice cream.' }
        ]
    }
  };

async function uploadbonsMenuItems() {
  try {
    for (const category in bonsMenuItems) {
      for (const subcategory in bonsMenuItems[category]) {
        for (const item of bonsMenuItems[category][subcategory]) {
          // Create a properly formatted document object.
          const menuItemDocument = {
            category: category,
            subcategory: subcategory,
            title: item.title,
            price: item.price,
            imageUrl: item.imageUrl,
            description: item.description,
          };


          await db.collection('bonsMenuItems').add(menuItemDocument);  // Add to Firestore
          console.log(`Added item: ${item.title} (Category: ${category}, Subcategory: ${subcategory})`);
        }
      }
    }
    console.log("Menu items uploaded successfully!");
  } catch (error) {
    console.error("Error uploading menu items:", error);
  }
}

uploadbonsMenuItems();
