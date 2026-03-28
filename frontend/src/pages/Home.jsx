import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [currentSlides, setCurrentSlides] = useState({});

  // Fetch products from Neon database and group by category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://luxvira-api.onrender.com';
        const response = await fetch(`${API_URL}/api/products?showUnpublished=false`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Group products by category
          const grouped = data.reduce((acc, product) => {
            const category = product.category.toLowerCase();
            if (!acc[category]) acc[category] = [];
            acc[category].push({
              id: product.id,
              name: product.name,
              category: product.category,
              price: parseFloat(product.price),
              image: product.image_url,
              description: product.description
            });
            return acc;
          }, {});
          
          setProductsByCategory(grouped);
          
          // Initialize slide positions
          const initialSlides = {};
          Object.keys(grouped).forEach(cat => {
            initialSlides[cat] = 0;
          });
          setCurrentSlides(initialSlides);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    
    fetchProducts();
  }, []);

  // Auto-rotate each category slider
  useEffect(() => {
    if (Object.keys(productsByCategory).length === 0) return;
    
    const intervals = {};
    
    Object.keys(productsByCategory).forEach(category => {
      const products = productsByCategory[category];
      if (products.length > 4) {
        intervals[category] = setInterval(() => {
          setCurrentSlides(prev => ({
            ...prev,
            [category]: (prev[category] + 1) % Math.max(1, products.length - 4)
          }));
        }, 2500);
      }
    });
    
    return () => Object.values(intervals).forEach(clearInterval);
  }, [productsByCategory]);

  const nextSlide = (category) => {
    const products = productsByCategory[category];
    setCurrentSlides(prev => ({
      ...prev,
      [category]: (prev[category] + 1) % Math.max(1, products.length - 4)
    }));
  };

  const prevSlide = (category) => {
    const products = productsByCategory[category];
    setCurrentSlides(prev => ({
      ...prev,
      [category]: (prev[category] - 1 + Math.max(1, products.length - 4)) % Math.max(1, products.length - 4)
    }));
  };

  const getCategoryEmoji = (category) => {
    const emojis = { diffusers: '🌸', candles: '🕯️', gypsum: '✨', decor: '🏺' };
    return emojis[category.toLowerCase()] || '🛍️';
  };

  const getCategoryColor = (category) => {
    const colors = { diffusers: '#8B7355', candles: '#D4AF37', gypsum: '#B8860B', decor: '#A0522D' };
    return colors[category.toLowerCase()] || '#8B7355';
  };

  const categories = ['diffusers', 'candles', 'gypsum', 'decor'];

  return (
    <div style={{ fontFamily: 'Arial' }}>
      
      {/* ===== CATEGORY SLIDERS ===== */}
      {categories.map(category => {
        const products = productsByCategory[category] || [];
        const slideIndex = currentSlides[category] || 0;
        
        return (
          <section key={category} style={{
            padding: '30px 20px',
            background: category === 'diffusers' ? '#FFF9F5' : 
                        category === 'candles' ? '#FFFBF0' : 
                        category === 'gypsum' ? '#FFFDF5' : '#FFF9F5'
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  color: getCategoryColor(category),
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textTransform: 'capitalize'
                }}>
                  {getCategoryEmoji(category)} {category}
                </h2>
                <Link
                  to={`/products?category=${category}`}
                  style={{
                    color: getCategoryColor(category),
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  View All →
                </Link>
              </div>

              {/* Slider Container */}
              <div style={{ position: 'relative', overflow: 'hidden', padding: '0 40px' }}>
                <div style={{
                  display: 'flex',
                  transition: 'transform 0.5s ease-in-out',
                  transform: `translateX(-${slideIndex * (100/4)}%)`,
                  gap: '15px'
                }}>
                  {products.length > 0 ? products.map(product => (
                    <div key={product.id} style={{
                      minWidth: 'calc(25% - 12px)',
                      background: 'white',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#f9f9f9' }}
                      />
                      <div style={{ padding: '15px' }}>
                        <h3 style={{ margin: '0 0 6px', color: '#333', fontSize: '1rem', minHeight: '40px', overflow: 'hidden' }}>
                          {product.name}
                        </h3>
                        <p style={{ margin: '0 0 10px', color: '#666', fontSize: '0.85rem', minHeight: '35px', overflow: 'hidden' }}>
                          {product.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: getCategoryColor(category) }}>
                            ₦{product.price.toLocaleString()}
                          </span>
                          <Link
                            to="/cart"
                            style={{
                              padding: '6px 12px',
                              background: getCategoryColor(category),
                              color: 'white',
                              borderRadius: '5px',
                              textDecoration: 'none',
                              fontWeight: '500',
                              fontSize: '0.85rem'
                            }}
                          >
                            Add
                          </Link>
                        </div>
                      </div>
                    </div>
                  )) : (
                    // Empty state
                    [1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        minWidth: 'calc(25% - 12px)',
                        background: 'white',
                        borderRadius: '10px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
                      }}>
                        <p style={{ color: '#999', margin: 0 }}>Coming Soon</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Navigation Arrows */}
                {products.length > 4 && (
                  <>
                    <button onClick={() => prevSlide(category)} style={{
                      position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)',
                      background: 'white', border: '2px solid #ddd', borderRadius: '50%',
                      width: '35px', height: '35px', fontSize: '1rem', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                    }}>←</button>
                    <button onClick={() => nextSlide(category)} style={{
                      position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)',
                      background: 'white', border: '2px solid #ddd', borderRadius: '50%',
                      width: '35px', height: '35px', fontSize: '1rem', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                    }}>→</button>
                  </>
                )}
              </div>

              {/* Dots Indicator */}
              {products.length > 4 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '15px' }}>
                  {Array.from({ length: Math.max(1, products.length - 4) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlides(prev => ({ ...prev, [category]: index }))}
                      style={{
                        width: '8px', height: '8px', borderRadius: '50%', border: 'none',
                        background: slideIndex === index ? getCategoryColor(category) : '#ddd',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* ===== SHOP ALL BUTTON ===== */}
      <section style={{ padding: '40px 20px', textAlign: 'center', background: 'white' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: '15px 50px',
            background: '#8B7355',
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textDecoration: 'none',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#6d5a43'}
          onMouseLeave={(e) => e.target.style.background = '#8B7355'}
        >
          🛍️ Shop All Products
        </Link>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section style={{ padding: '40px 20px', textAlign: 'center', background: '#FFF9F5' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#8B7355', marginBottom: '30px', fontSize: '1.8rem' }}>✨ Why Choose Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '25px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌿</div>
              <h3 style={{ color: '#333', marginBottom: '8px' }}>Handcrafted</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Made with care & premium ingredients</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚚</div>
              <h3 style={{ color: '#333', marginBottom: '8px' }}>Fast Delivery</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Quick shipping across Nigeria</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💯</div>
              <h3 style={{ color: '#333', marginBottom: '8px' }}>Quality Guaranteed</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>100% satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section style={{
        padding: '40px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #8B7355 0%, #6d5a43 100%)',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '15px' }}>Ready to Transform Your Space?</h2>
        <p style={{ fontSize: '1rem', marginBottom: '25px', opacity: 0.9 }}>
          Browse our complete collection of handcrafted home fragrances and decor
        </p>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: '12px 35px',
            background: 'white',
            color: '#8B7355',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            textDecoration: 'none'
          }}
        >
          Shop Now →
        </Link>
      </section>
    </div>
  );
}
