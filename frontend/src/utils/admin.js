// Admin utilities - Firebase Auth integrated
import { 
  signInWithGoogle, 
  signOutUser, 
  onAuthStateChange, 
  getCurrentUser,
  isAdminEmail 
} from '../firebase';

const PRODUCTS_KEY = 'luxvira_products';

// ===== AUTH FUNCTIONS =====
export const isAdminLoggedIn = () => getCurrentUser() !== null;
export const getCurrentAdmin = () => getCurrentUser();
export const loginAdmin = async () => await signInWithGoogle();
export const logoutAdmin = async () => { await signOutUser(); };
export const subscribeToAuth = (callback) => onAuthStateChange(callback);

// ===== PRODUCT FUNCTIONS (localStorage) =====
export const getProducts = () => {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product) => {
  if (!isAdminLoggedIn()) return { success: false, error: 'Not authenticated' };
  const products = getProducts();
  const newProduct = {
    ...product,
    id: product.id || Date.now(),
    createdAt: product.createdAt || new Date().toISOString(),
    isPublished: product.isPublished !== false
  };
  const idx = products.findIndex(p => p.id === newProduct.id);
  if (idx >= 0) products[idx] = newProduct;
  else products.push(newProduct);
  saveProducts(products);
  return { success: true, product: newProduct };
};

export const updateProduct = (id, updates) => {
  if (!isAdminLoggedIn()) return { success: false, error: 'Not authenticated' };
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return { success: false, error: 'Not found' };
  products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return { success: true, product: products[idx] };
};

export const deleteProduct = (id) => {
  if (!isAdminLoggedIn()) return { success: false, error: 'Not authenticated' };
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  return { success: true };
};

export const togglePublish = (id) => {
  if (!isAdminLoggedIn()) return { success: false, error: 'Not authenticated' };
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return { success: false, error: 'Not found' };
  product.isPublished = !product.isPublished;
  saveProducts(products);
  return { success: true, product };
};
