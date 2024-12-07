const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Correct path

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
