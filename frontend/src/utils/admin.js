// Admin utilities - Database API integration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ADMIN_PASSWORD = 'luxvira2026';
const ADMIN_TOKEN_KEY = 'luxvira_admin_token';

// ===== AUTH FUNCTIONS (still localStorage for now) =====

export const isAdminLoggedIn = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY) === 'authenticated';
};

export const loginAdmin = (password) => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_TOKEN_KEY, 'authenticated');
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

// ===== API FUNCTIONS (Database) =====

// Get products from database API
export const getProducts = async () => {
  try {
    const isAdmin = isAdminLoggedIn();
    const url = `${API_URL}/api/products${isAdmin ? '?showUnpublished=true' : ''}`;
    
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch products');
    }
    
    const data = await response.json();
    
    // Map database fields to frontend fields
    return data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      image: p.image_url,
      description: p.description,
      isPublished: p.is_published,
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }));
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

// Add product to database API
export const addProduct = async (product) => {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        category: product.category,
        price: product.price,
        image_url: product.image,
        description: product.description || '',
        is_published: product.isPublished !== false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to add product');
    }
    
    const data = await response.json();
    
    return {
      success: true,
      product: {
        id: data.id,
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        image: data.image_url,
        description: data.description,
        isPublished: data.is_published
      }
    };
  } catch (err) {
    console.error('Error adding product:', err);
    return { success: false, error: err.message };
  }
};

// Update product in database API
export const updateProduct = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updates.name,
        category: updates.category,
        price: updates.price,
        image_url: updates.image,
        description: updates.description || '',
        is_published: updates.isPublished !== false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update product');
    }
    
    const data = await response.json();
    
    return {
      success: true,
      product: {
        id: data.id,
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        image: data.image_url,
        description: data.description,
        isPublished: data.is_published
      }
    };
  } catch (err) {
    console.error('Error updating product:', err);
    return { success: false, error: err.message };
  }
};

// Delete product from database API
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete product');
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error deleting product:', err);
    return { success: false, error: err.message };
  }
};

// Toggle publish status via API
export const togglePublish = async (id) => {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }
    
    return await updateProduct(id, { isPublished: !product.isPublished });
  } catch (err) {
    console.error('Error toggling publish:', err);
    return { success: false, error: err.message };
  }
};
