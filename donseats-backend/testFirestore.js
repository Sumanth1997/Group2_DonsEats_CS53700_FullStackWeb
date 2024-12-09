const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json'); // Correct path

// Decode the environment variable and parse it into an object
const serviceAccount = JSON.parse(
   Buffer.from(process.env.FIREBASE_CREDENTIALS, 'base64').toString('utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function testFirestore() {
    try {
        const collections = await db.listCollections();
        console.log(collections);
    } catch (error) {
        console.error("Firestore test error:", error);
    }
}

testFirestore();
