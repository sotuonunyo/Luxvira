// Simple admin utilities (localStorage for now, backend-ready)

const ADMIN_PASSWORD = 'luxvira2026'; // Change this to your secure password!
const ADMIN_TOKEN_KEY = 'luxvira_admin_token';
const PRODUCTS_STORAGE_KEY = 'luxvira_products';

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

// Get products (from localStorage or backend)
export const getProducts = () => {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save products (to localStorage or backend)
export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  return { success: true };
};

// Add new product
export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now(), // Simple unique ID
    createdAt: new Date().toISOString(),
    isPublished: true
  };
  products.push(newProduct);
  saveProducts(products);
  return { success: true, product: newProduct };
};

// Update product
export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return { success: false, error: 'Product not found' };
  
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return { success: true, product: products[index] };
};

// Delete product
export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return { success: true };
};

// Toggle publish status
export const togglePublish = (id) => {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return { success: false, error: 'Product not found' };
  
  product.isPublished = !product.isPublished;
  saveProducts(products);
  return { success: true, product };
};
