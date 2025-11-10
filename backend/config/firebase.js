const admin = require('firebase-admin');

// Firebase Admin SDK initialization
const initializeFirebase = () => {
  try {
    // Service account key will be provided via environment variable
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : require('./serviceAccountKey.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

const db = () => admin.firestore();
const auth = () => admin.auth();
const storage = () => admin.storage();

module.exports = {
  initializeFirebase,
  db,
  auth,
  storage,
  admin
};
