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
            if (!acc[category]) {
              acc[category] = [];
            }
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
          
          // Initialize slide positions for each category
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
      if (products.length > 3) { // Only auto-rotate if more than 3 products
        intervals[category] = setInterval(() => {
          setCurrentSlides(prev => ({
            ...prev,
            [category]: (prev[category] + 1) % (products.length - 2)
          }));
        }, 2500); // 2.5 seconds
      }
    });
    
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [productsByCategory]);

  const nextSlide = (category) => {
    const products = productsByCategory[category];
    setCurrentSlides(prev => ({
      ...prev,
      [category]: (prev[category] + 1) % (products.length - 2)
    }));
  };

  const prevSlide = (category) => {
    const products = productsByCategory[category];
    setCurrentSlides(prev => ({
      ...prev,
      [category]: (prev[category] - 1 + products.length - 2) % (products.length - 2)
    }));
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      diffusers: '🌸',
      candles: '🕯️',
      gypsum: '✨',
      decor: '🏺'
    };
    return emojis[category.toLowerCase()] || '🛍️';
  };

  const getCategoryColor = (category) => {
    const colors = {
      diffusers: '#8B7355',
      candles: '#D4AF37',
      gypsum: '#B8860B',
      decor: '#A0522D'
    };
    return colors[category.toLowerCase()] || '#8B7355';
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      {/* ===== WELCOME SECTION (No Logo) ===== */}
      <section style={{ 
        padding: '80px 20px', 
        textAlign: 'center', 
        maxWidth: '900px', 
        margin: '0 auto',
        background: 'linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%)'
      }}>
        <h1 style={{ 
          color: '#8B7355', 
          fontSize: '3rem', 
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          Welcome to Luxvira Scents
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          color: '#666', 
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Handcrafted diffusers, scented candles, gypsum crafts & interior decor.<br/>
          Made with love in Nigeria ✨
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/products"
            style={{
              padding: '15px 40px',
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
          <Link
            to="/contact"
            style={{
              padding: '15px 40px',
              background: '#F5E6D3',
              color: '#333',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textDecoration: 'none'
            }}
          >
            📬 Contact Us
          </Link>
        </div>
      </section>

      {/* ===== CATEGORY SLIDERS ===== */}
      {Object.keys(productsByCategory).length > 0 ? (
        Object.entries(productsByCategory).map(([category, products]) => (
          products.length > 0 && (
            <section key={category} style={{
              padding: '60px 20px',
              background: category === 'diffusers' ? '#FFF9F5' : 
                          category === 'candles' ? '#FFFBF0' : 
                          category === 'gypsum' ? '#FFFDF5' : '#FFF9F5'
            }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Category Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '30px'
                }}>
                  <h2 style={{
                    fontSize: '2rem',
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
                      fontSize: '1rem'
                    }}
                  >
                    View All →
                  </Link>
                </div>

                {/* Slider Container */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '0 50px'
                }}>
                  {/* Slider Track */}
                  <div style={{
                    display: 'flex',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${(currentSlides[category] || 0) * (100/3)}%)`,
                    gap: '20px'
                  }}>
                    {products.map(product => (
                      <div key={product.id} style={{
                        minWidth: 'calc(33.333% - 14px)',
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                            background: '#f9f9f9'
                          }}
                        />
                        <div style={{ padding: '20px' }}>
                          <h3 style={{
                            margin: '0 0 8px',
                            color: '#333',
                            fontSize: '1.1rem',
                            minHeight: '50px'
                          }}>
                            {product.name}
                          </h3>
                          <p style={{
                            margin: '0 0 12px',
                            color: '#666',
                            fontSize: '0.9rem',
                            minHeight: '40px'
                          }}>
                            {product.description}
                          </p>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{
                              fontSize: '1.3rem',
                              fontWeight: 'bold',
                              color: getCategoryColor(category)
                            }}>
                              ₦{product.price.toLocaleString()}
                            </span>
                            <Link
                              to="/cart"
                              style={{
                                padding: '8px 16px',
                                background: getCategoryColor(category),
                                color: 'white',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                              }}
                            >
                              Add to Cart
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {products.length > 3 && (
                    <>
                      <button
                        onClick={() => prevSlide(category)}
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'white',
                          border: '2px solid #ddd',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        ←
                      </button>
                      <button
                        onClick={() => nextSlide(category)}
                        style={{
                          position: 'absolute',
                          right: '0',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'white',
                          border: '2px solid #ddd',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Dots Indicator */}
                {products.length > 3 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '20px'
                  }}>
                    {Array.from({ length: products.length - 2 }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlides(prev => ({ ...prev, [category]: index }))}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          border: 'none',
                          background: (currentSlides[category] || 0) === index 
                            ? getCategoryColor(category) 
                            : '#ddd',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )
        ))
      ) : (
        // Fallback: Show category sections with sample products
        <>
          {['diffusers', 'candles', 'gypsum', 'decor'].map(category => (
            <section key={category} style={{
              padding: '60px 20px',
              background: category === 'diffusers' ? '#FFF9F5' : 
                          category === 'candles' ? '#FFFBF0' : 
                          category === 'gypsum' ? '#FFFDF5' : '#FFF9F5'
            }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{
                  fontSize: '2rem',
                  color: getCategoryColor(category),
                  marginBottom: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textTransform: 'capitalize'
                }}>
                  {getCategoryEmoji(category)} {category}
                </h2>
                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                  Products coming soon... Check back later! 🎨
                </p>
              </div>
            </section>
          ))}
        </>
      )}

      {/* ===== WHY CHOOSE US SECTION ===== */}
      <section style={{ padding: '60px 20px', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#8B7355', marginBottom: '40px', fontSize: '2rem' }}>
            ✨ Why Choose Us?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌿</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>Handcrafted</h3>
              <p style={{ color: '#666' }}>Made with care & premium ingredients</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚚</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>Fast Delivery</h3>
              <p style={{ color: '#666' }}>Quick shipping across Nigeria</p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💯</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>Quality Guaranteed</h3>
              <p style={{ color: '#666' }}>100% satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section style={{
        padding: '60px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #8B7355 0%, #6d5a43 100%)',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          Ready to Transform Your Space?
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9 }}>
          Browse our complete collection of handcrafted home fragrances and decor
        </p>
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: '15px 40px',
            background: 'white',
            color: '#8B7355',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textDecoration: 'none'
          }}
        >
          Shop Now →
        </Link>
      </section>
    </div>
  );
}
