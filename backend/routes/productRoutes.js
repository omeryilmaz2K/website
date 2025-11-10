const express = require('express');
const router = express.Router();
const { db, storage } = require('../config/firebase');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (for Firebase Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Helper function to upload file to Firebase Storage
const uploadToFirebase = async (file) => {
  const bucket = storage().bucket();
  const fileName = `products/${Date.now()}-${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('finish', async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
};

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, platform, sort } = req.query;
    let productsRef = db().collection('products');

    // Apply filters
    if (category) {
      productsRef = productsRef.where('category', '==', category);
    }

    if (platform) {
      productsRef = productsRef.where('platform', '==', platform);
    }

    // Get products
    let snapshot = await productsRef.get();
    let products = [];

    snapshot.forEach(doc => {
      const product = {
        id: doc.id,
        ...doc.data()
      };
      products.push(product);
    });

    // Apply search filter (client-side)
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      products.sort((a, b) => a.name?.localeCompare(b.name));
    } else {
      // Default sort by createdAt (newest first)
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Populate category info
    for (let product of products) {
      if (product.category) {
        const categoryDoc = await db().collection('categories').doc(product.category).get();
        if (categoryDoc.exists) {
          product.categoryInfo = {
            id: categoryDoc.id,
            name: categoryDoc.data().name,
            slug: categoryDoc.data().slug
          };
        }
      }
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const productsRef = db().collection('products');
    const snapshot = await productsRef.where('featured', '==', true).limit(8).get();

    const products = [];
    for (const doc of snapshot.docs) {
      const product = {
        id: doc.id,
        ...doc.data()
      };

      // Populate category
      if (product.category) {
        const categoryDoc = await db().collection('categories').doc(product.category).get();
        if (categoryDoc.exists) {
          product.categoryInfo = {
            id: categoryDoc.id,
            name: categoryDoc.data().name,
            slug: categoryDoc.data().slug
          };
        }
      }

      products.push(product);
    }

    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const productDoc = await db().collection('products').doc(req.params.id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = {
      id: productDoc.id,
      ...productDoc.data()
    };

    // Populate category
    if (product.category) {
      const categoryDoc = await db().collection('categories').doc(product.category).get();
      if (categoryDoc.exists) {
        product.categoryInfo = {
          id: categoryDoc.id,
          name: categoryDoc.data().name,
          slug: categoryDoc.data().slug
        };
      }
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    // Upload images to Firebase Storage
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToFirebase(file);
        imageUrls.push(url);
      }
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      images: imageUrls,
      brand: req.body.brand || '',
      platform: req.body.platform || '',
      condition: req.body.condition || 'Yeni',
      stock: parseInt(req.body.stock) || 0,
      featured: req.body.featured === 'true' || req.body.featured === true,
      tags: req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : [],
      specifications: req.body.specifications ? (typeof req.body.specifications === 'string' ? JSON.parse(req.body.specifications) : req.body.specifications) : {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db().collection('products').add(productData);
    const newProduct = await docRef.get();

    res.status(201).json({
      id: newProduct.id,
      ...newProduct.data()
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const productRef = db().collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingProduct = productDoc.data();

    // Upload new images to Firebase Storage
    let imageUrls = existingProduct.images || [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToFirebase(file);
        imageUrls.push(url);
      }
    }

    const updateData = {
      name: req.body.name !== undefined ? req.body.name : existingProduct.name,
      description: req.body.description !== undefined ? req.body.description : existingProduct.description,
      price: req.body.price !== undefined ? parseFloat(req.body.price) : existingProduct.price,
      category: req.body.category !== undefined ? req.body.category : existingProduct.category,
      images: imageUrls,
      brand: req.body.brand !== undefined ? req.body.brand : existingProduct.brand,
      platform: req.body.platform !== undefined ? req.body.platform : existingProduct.platform,
      condition: req.body.condition !== undefined ? req.body.condition : existingProduct.condition,
      stock: req.body.stock !== undefined ? parseInt(req.body.stock) : existingProduct.stock,
      featured: req.body.featured !== undefined ? (req.body.featured === 'true' || req.body.featured === true) : existingProduct.featured,
      tags: req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : existingProduct.tags,
      specifications: req.body.specifications ? (typeof req.body.specifications === 'string' ? JSON.parse(req.body.specifications) : req.body.specifications) : existingProduct.specifications,
      updatedAt: new Date().toISOString()
    };

    await productRef.update(updateData);
    const updatedProduct = await productRef.get();

    res.json({
      id: updatedProduct.id,
      ...updatedProduct.data()
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const productRef = db().collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // TODO: Optionally delete images from Firebase Storage
    // const product = productDoc.data();
    // if (product.images && product.images.length > 0) {
    //   for (const imageUrl of product.images) {
    //     // Delete image from storage
    //   }
    // }

    await productRef.delete();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
