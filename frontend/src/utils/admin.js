// Get products from database API
export const getProducts = async () => {
  try {
    const isAdmin = isAdminLoggedIn();
    const url = `${API_URL}/api/products${isAdmin ? '?showUnpublished=true' : ''}`;
    
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch products'}`);
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
    console.error('❌ Error fetching products:', err);
    // Return empty array on error so UI doesn't crash
    return [];
  }
};

// Add product to database API
export const addProduct = async (product) => {
  try {
    console.log('📤 Sending product to API:', product);
    
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
    
    console.log('📥 API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorText = await response.text().catch(() => '');
      console.error('❌ API error response:', errorData || errorText);
      throw new Error(errorData.error || errorText || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Product added successfully:', data);
    
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
    console.error('❌ Error adding product:', err);
    return { success: false, error: err.message };
  }
};
