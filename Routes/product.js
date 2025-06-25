const express = require('express');
const { v4: uuidv4 } = require('uuid');

const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const router = express.Router();

// In-memory product list
let products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Blender',
    description: 'Kitchen blender',
    price: 60,
    category: 'kitchen',
    inStock: false
  },
  {
    id: uuidv4(),
    name: 'Smartphone',
    description: '128GB storage smartphone',
    price: 800,
    category: 'electronics',
    inStock: true
  }
];


// GET /api/products — with filtering, search, and pagination
router.get('/', (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;

  let results = [...products];

  // Filter by category
  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search by name
  if (search) {
    results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  // Pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const paginatedResults = results.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: results.length,
    results: paginatedResults
  });
});


// GET /api/products/:id — Get product by ID
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});


// POST /api/products — Create product (with auth & validation)
router.post('/', auth, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});


// PUT /api/products/:id — Update product
router.put('/:id', auth, validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));

    const { name, description, price, category, inStock } = req.body;
    const existing = products[index];

    products[index] = {
      ...existing,
      name,
      description,
      price,
      category,
      inStock
    };

    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});


// DELETE /api/products/:id — Delete product
router.delete('/:id', auth, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));

    const deleted = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deleted[0] });
  } catch (err) {
    next(err);
  }
});


// GET /api/products/stats — Product count by category
router.get('/stats', (req, res) => {
  const stats = {};

  for (const product of products) {
    const category = product.category.toLowerCase();
    stats[category] = (stats[category] || 0) + 1;
  }

  res.json({
    totalProducts: products.length,
    productsByCategory: stats
  });
});

module.exports = router;
