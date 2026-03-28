// Simple admin utilities (localStorage for now, backend-ready)
const ADMIN_PASSWORD = 'luxvira2026';
const ADMIN_TOKEN_KEY = 'luxvira_admin_token';
const PRODUCTS_STORAGE_KEY = 'luxvira_products';

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
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    isPublished: true
  };
  products.push(newProduct);
  saveProducts(products);
  return { success: true, product: newProduct };
};

export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return { success: false, error: 'Product not found' };
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return { success: true, product: products[index] };
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return { success: true };
};

export const togglePublish = (id) => {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return { success: false, error: 'Product not found' };
  product.isPublished = !product.isPublished;
  saveProducts(products);
  return { success: true, product };
};
