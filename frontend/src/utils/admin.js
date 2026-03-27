// Admin utilities - NOW WITH DATABASE API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ADMIN_PASSWORD = 'luxvira2026';
const ADMIN_TOKEN_KEY = 'luxvira_admin_token';

// Check if admin is logged in
export const isAdminLoggedIn = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY) === 'authenticated';
};

// Login admin
export const loginAdmin = (password) => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_TOKEN_KEY, 'authenticated');
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
};

// Logout admin
export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

// ===== API FUNCTIONS (Database) =====

// Get products from database
export const getProducts = async () => {
  try {
    const isAdmin = isAdminLoggedIn();
    const url = `${API_URL}/api/products${isAdmin ? '?showUnpublished=true' : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    
    // Map database fields to frontend fields
    return data.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      image: p.image_url,
      description: p.description,
      isPublished: p.is_published
    }));
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

// Add product to database
export const addProduct = async (product) => {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        image_url: product.image
      })
    });
    if (!response.ok) throw new Error('Failed to add');
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

// Update product in database
export const updateProduct = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        image_url: updates.image
      })
    });
    if (!response.ok) throw new Error('Failed to update');
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

// Delete product from database
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
    return { success: true };
  } catch (err) {
    console.error('Error deleting product:', err);
    return { success: false, error: err.message };
  }
};

// Toggle publish status
export const togglePublish = async (id) => {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return { success: false, error: 'Product not found' };
    
    return await updateProduct(id, { is_published: !product.isPublished });
  } catch (err) {
    console.error('Error toggling publish:', err);
    return { success: false, error: err.message };
  }
};
