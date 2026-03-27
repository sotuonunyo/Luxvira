// Admin utilities - Firebase Auth integrated
import { 
  signInWithGoogle, 
  signOutUser, 
  onAuthStateChange, 
  getCurrentUser,
  isAdminEmail 
} from '../firebase';

const PRODUCTS_STORAGE_KEY = 'luxvira_products';

// ✅ Check if admin is logged in (via Firebase)
export const isAdminLoggedIn = () => {
  return getCurrentUser() !== null;
};

// ✅ Get current admin user - PROPERLY EXPORTED
export const getCurrentAdmin = () => {
  return getCurrentUser();
};

// Login via Google (returns promise)
export const loginAdmin = async () => {
  return await signInWithGoogle();
};

// Logout
export const logoutAdmin = async () => {
  await signOutUser();
};

// Subscribe to auth changes
export const subscribeToAuth = (callback) => {
  return onAuthStateChange(callback);
};

// ===== PRODUCT MANAGEMENT (localStorage for now) =====

export const getProducts = () => {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  return { success: true };
};

export const addProduct = (product) => {
  if (!isAdminLoggedIn()) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const products = getProducts();
  const newProduct = {
    ...product,
    id: product.id || Date.now(),
    createdAt: product.createdAt || new Date().toISOString(),
    isPublished: product.isPublished !== false
  };
  
  const existingIndex = products.findIndex(p => p.id === newProduct.id);
  if (existingIndex >= 0) {
    products[existingIndex] = newProduct;
  } else {
    products.push(newProduct);
  }
  
  saveProducts(products);
  return { success: true, product: newProduct };
};

export const updateProduct = (id, updates) => {
  if (!isAdminLoggedIn()) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return { success: false, error: 'Product not found' };
  
  products[index] = { 
    ...products[index], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  
  saveProducts(products);
  return { success: true, product: products[index] };
};

export const deleteProduct = (id) => {
  if (!isAdminLoggedIn()) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return { success: true };
};

export const togglePublish = (id) => {
  if (!isAdminLoggedIn()) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return { success: false, error: 'Product not found' };
  
  product.isPublished = !product.isPublished;
  saveProducts(products);
  return { success: true, product };
};
