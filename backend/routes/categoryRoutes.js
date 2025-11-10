const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { protect, admin } = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categoriesRef = db().collection('categories');
    const snapshot = await categoriesRef.orderBy('name', 'asc').get();

    const categories = [];
    snapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryDoc = await db().collection('categories').doc(req.params.id).get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      id: categoryDoc.id,
      ...categoryDoc.data()
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post('/', protect, admin, async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db().collection('categories').add(categoryData);
    const newCategory = await docRef.get();

    res.status(201).json({
      id: newCategory.id,
      ...newCategory.data()
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update category
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const categoryRef = db().collection('categories').doc(req.params.id);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await categoryRef.update(updateData);
    const updatedCategory = await categoryRef.get();

    res.json({
      id: updatedCategory.id,
      ...updatedCategory.data()
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete category
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const categoryRef = db().collection('categories').doc(req.params.id);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await categoryRef.delete();
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
