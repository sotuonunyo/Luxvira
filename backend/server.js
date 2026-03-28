require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS Configuration - Allow your Vercel frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== PRODUCT ROUTES =====

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, showUnpublished } = req.query;
    let query = 'SELECT * FROM products';
    const conditions = [];
    const params = [];
    
    // Only show published products by default
    if (!showUnpublished) {
      conditions.push('is_published = true');
    }
    
    // Filter by category if provided
    if (category && category !== 'all') {
      conditions.push('category = $' + (params.length + 1));
      params.push(category);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, image_url, description, is_published } = req.body;
    
    // Validate required fields
    if (!name || !category || !price || !image_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await db.query(
      `INSERT INTO products (name, category, price, image_url, description, is_published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, category, price, image_url, description || '', is_published !== false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update existing product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, image_url, description, is_published } = req.body;
    
    const result = await db.query(
      `UPDATE products 
       SET name = $1, category = $2, price = $3, image_url = $4, 
           description = $5, is_published = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [name, category, price, image_url, description, is_published, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Toggle publish status (convenience endpoint)
app.patch('/api/products/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;
    
    const result = await db.query(
      `UPDATE products SET is_published = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [is_published, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error toggling publish:', err);
    res.status(500).json({ error: 'Failed to update publish status' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 API endpoint: http://localhost:${PORT}/api/products`);
});
