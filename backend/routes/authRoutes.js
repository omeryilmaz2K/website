const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db, auth } = require('../config/firebase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const usersRef = db().collection('users');
    const emailSnapshot = await usersRef.where('email', '==', email).get();
    const usernameSnapshot = await usersRef.where('username', '==', username).get();

    if (!emailSnapshot.empty || !usernameSnapshot.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create Firebase Auth user
    const userRecord = await auth().createUser({
      email,
      password,
      displayName: username
    });

    // Hash password for Firestore
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await usersRef.doc(userRecord.uid).set(userData);

    res.status(201).json({
      uid: userRecord.uid,
      username,
      email,
      role: userData.role,
      token: generateToken(userRecord.uid)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user from Firestore
    const usersRef = db().collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      uid: user.uid,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.uid)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
