const db = require('../config/database');

// Get published products (customer-facing)
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE is_published = true';
    const params = [];
    
    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY display_order, created_at DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1 AND is_published = true',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Admin: Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, additional_info, is_published, display_order } = req.body;
    const image_url = req.file?.path; // From Cloudinary
    
    const result = await db.query(
      `INSERT INTO products (name, description, price, category, image_url, additional_info, is_published, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, description, price, category, image_url, additional_info, is_published ?? false, display_order ?? 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, additional_info, is_published, display_order } = req.body;
    const image_url = req.file?.path;
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    if (name) { updates.push(`name = $${paramIndex++}`); values.push(name); }
    if (description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(description); }
    if (price) { updates.push(`price = $${paramIndex++}`); values.push(price); }
    if (category) { updates.push(`category = $${paramIndex++}`); values.push(category); }
    if (image_url) { updates.push(`image_url = $${paramIndex++}`); values.push(image_url); }
    if (additional_info) { updates.push(`additional_info = $${paramIndex++}`); values.push(additional_info); }
    if (is_published !== undefined) { updates.push(`is_published = $${paramIndex++}`); values.push(is_published); }
    if (display_order !== undefined) { updates.push(`display_order = $${paramIndex++}`); values.push(display_order); }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
