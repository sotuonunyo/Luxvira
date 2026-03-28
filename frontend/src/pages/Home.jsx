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
      if (products.length > 3) {
        intervals[category] = setInterval(() => {
          setCurrentSlides(prev => ({
            ...prev,
            [category]: (prev[category] + 1) % Math.max(1, products.length - 3)
          }));
        }, 3000);
      }
    });
    
    return () => Object.values(intervals).forEach(clearInterval);
  }, [productsByCategory]);

  const nextSlide = (category) => {
    const products = productsByCategory[category];
    setCurrentSlides(prev => ({
      ...prev,
      [category]: (prev[category] + 1) % Math.max(1, products.length - 3)
    }));
  };

  const prevSlide = (category) => {
    const products = productsByCategory[category];
    setCurrentSlides(prev => ({
      ...prev,
      [category]: (prev[category] - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3)
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
        const categoryColor = getCategoryColor(category);
        
        return (
          <section key={category} style={{
            padding: '25px 0',
            background: category === 'diffusers' ? '#FFF9F5' : 
                        category === 'candles' ? '#FFFBF0' : 
                        category === 'gypsum' ? '#FFFDF5' : '#FFF9F5',
            borderBottom: '1px solid #eee'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
              
              {/* Category Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '1.4rem',
                  color: categoryColor,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textTransform: 'capitalize',
                  fontWeight: '700'
                }}>
                  {getCategoryEmoji(category)} {category}
                </h2>
                <Link
                  to={`/products?category=${category}`}
                  style={{
                    color: categoryColor,
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  View All →
                </Link>
              </div>

              {/* Slider Container */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Slider Track */}
                <div style={{
                  display: 'flex',
                  transition: 'transform 0.5s ease-in-out',
                  transform: `translateX(-${slideIndex * (100/3)}%)`,
                  gap: '15px'
                }}>
                  {products.length > 0 ? products.map(product => (
                    <div key={product.id} style={{
                      minWidth: 'calc(33.333% - 10px)',
                      background: 'white',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Product Image - Better sizing */}
                      <div style={{
                        position: 'relative',
                        paddingTop: '75%', // 4:3 aspect ratio (better than 1:1)
                        overflow: 'hidden',
                        background: '#f9f9f9'
                      }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain', // Show full product
                            padding: '10px'
                          }}
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{
                          margin: '0 0 6px',
                          color: '#333',
                          fontSize: '0.95rem',
                          lineHeight: '1.3',
                          minHeight: '40px',
                          overflow: 'hidden'
                        }}>
                          {product.name}
                        </h3>
                        <p style={{
                          margin: '0 0 10px',
                          color: '#666',
                          fontSize: '0.8rem',
                          lineHeight: '1.4',
                          flex: 1,
                          minHeight: '45px',
                          overflow: 'hidden'
                        }}>
                          {product.description}
                        </p>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 'auto'
                        }}>
                          <span style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: categoryColor
                          }}>
                            ₦{product.price.toLocaleString()}
                          </span>
                          <Link
                            to="/cart"
                            style={{
                              padding: '6px 12px',
                              background: categoryColor,
                              color: 'white',
                              borderRadius: '5px',
                              textDecoration: 'none',
                              fontWeight: '600',
                              fontSize: '0.8rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Add
                          </Link>
                        </div>
                      </div>
                    </div>
                  )) : (
                    // Empty state
                    <div style={{
                      minWidth: 'calc(33.333% - 10px)',
                      background: 'white',
                      borderRadius: '10px',
                      padding: '50px 20px',
                      textAlign: 'center',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ color: '#999', margin: 0, fontSize: '0.95rem' }}>
                        Products coming soon... 🎨
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                {products.length > 3 && (
                  <>
                    <button
                      onClick={() => prevSlide(category)}
                      style={{
                        position: 'absolute',
                        left: '5px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        color: categoryColor
                      }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextSlide(category)}
                      style={{
                        position: 'absolute',
                        right: '5px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        color: categoryColor
                      }}
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                {products.length > 3 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '12px'
                  }}>
                    {Array.from({ length: Math.max(1, products.length - 3) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlides(prev => ({ ...prev, [category]: index }))}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          border: 'none',
                          background: slideIndex === index ? categoryColor : '#ddd',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* ===== SHOP ALL BUTTON ===== */}
      <section style={{ padding: '30px 20px', textAlign: 'center', background: 'white' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: '14px 45px',
            background: '#8B7355',
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            textDecoration: 'none',
            transition: 'background 0.2s',
            boxShadow: '0 4px 12px rgba(139,115,85,0.3)'
          }}
          onMouseEnter={(e) => e.target.style.background = '#6d5a43'}
          onMouseLeave={(e) => e.target.style.background = '#8B7355'}
        >
          🛍️ Shop All Products
        </Link>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section style={{ padding: '35px 20px', textAlign: 'center', background: '#FFF9F5' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#8B7355', marginBottom: '25px', fontSize: '1.6rem' }}>✨ Why Choose Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '25px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌿</div>
              <h3 style={{ color: '#333', marginBottom: '8px', fontSize: '1rem' }}>Handcrafted</h3>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>Made with care & premium ingredients</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚚</div>
              <h3 style={{ color: '#333', marginBottom: '8px', fontSize: '1rem' }}>Fast Delivery</h3>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>Quick shipping across Nigeria</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💯</div>
              <h3 style={{ color: '#333', marginBottom: '8px', fontSize: '1rem' }}>Quality Guaranteed</h3>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>100% satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section style={{
        padding: '35px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #8B7355 0%, #6d5a43 100%)',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Ready to Transform Your Space?</h2>
        <p style={{ fontSize: '0.95rem', marginBottom: '20px', opacity: 0.9 }}>
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
