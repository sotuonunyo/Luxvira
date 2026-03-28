import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch featured products from Neon database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://luxvira-api.onrender.com';
        const response = await fetch(`${API_URL}/api/products?showUnpublished=false`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Map database fields and take first 5 for slideshow
          const products = data.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price),
            image: p.image_url,
            description: p.description
          }));
          
          setFeaturedProducts(products);
        } else {
          // Fallback to sample products if API fails
          setFeaturedProducts([
            {
              id: 1,
              name: 'Lavender Dream Diffuser',
              category: 'diffusers',
              price: 4500,
              image: 'https://placehold.co/800x600/8B7355/FFFFFF?text=Lavender+Diffuser',
              description: 'Handcrafted reed diffuser with calming lavender scent. Lasts 60+ days.'
            },
            {
              id: 2,
              name: 'Vanilla Bean Candle',
              category: 'candles',
              price: 3200,
              image: 'https://placehold.co/800x600/F5E6D3/333333?text=Vanilla+Candle',
              description: 'Soy wax candle with pure vanilla essence. 40-hour burn time.'
            },
            {
              id: 3,
              name: 'Rose Gold Gypsum Tray',
              category: 'gypsum',
              price: 5800,
              image: 'https://placehold.co/800x600/D4AF37/FFFFFF?text=Gypsum+Tray',
              description: 'Elegant hand-poured gypsum tray with rose gold accents.'
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        // Fallback to sample products
        setFeaturedProducts([
          {
            id: 1,
            name: 'Lavender Dream Diffuser',
            category: 'diffusers',
            price: 4500,
            image: 'https://placehold.co/800x600/8B7355/FFFFFF?text=Lavender+Diffuser',
            description: 'Handcrafted reed diffuser with calming lavender scent. Lasts 60+ days.'
          },
          {
            id: 2,
            name: 'Vanilla Bean Candle',
            category: 'candles',
            price: 3200,
            image: 'https://placehold.co/800x600/F5E6D3/333333?text=Vanilla+Candle',
            description: 'Soy wax candle with pure vanilla essence. 40-hour burn time.'
          },
          {
            id: 3,
            name: 'Rose Gold Gypsum Tray',
            category: 'gypsum',
            price: 5800,
            image: 'https://placehold.co/800x600/D4AF37/FFFFFF?text=Gypsum+Tray',
            description: 'Elegant hand-poured gypsum tray with rose gold accents.'
          }
        ]);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  // Auto-rotate slideshow
  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
    }, 2500); // Change slide every 2.5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredProducts]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
    setIsAutoPlaying(false); // Pause auto-play on manual nav
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      {/* ===== HERO SLIDESHOW SECTION ===== */}
      {featuredProducts.length > 0 && (
        <section style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          overflow: 'hidden',
          background: '#f9f9f9'
        }}>
          {/* Slides */}
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentSlide * 100}%)`,
            height: '100%'
          }}>
            {featuredProducts.map((product, index) => (
              <div key={product.id} style={{
                minWidth: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '40px',
                  maxWidth: '1200px',
                  width: '100%',
                  flexWrap: 'wrap'
                }}>
                  {/* Product Image */}
                  <div style={{
                    flex: '1 1 400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        maxWidth: '400px',
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div style={{
                    flex: '1 1 300px',
                    textAlign: 'left',
                    padding: '20px'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 15px',
                      background: '#F5E6D3',
                      color: '#8B7355',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      marginBottom: '15px',
                      textTransform: 'capitalize'
                    }}>
                      {product.category}
                    </span>
                    <h2 style={{
                      fontSize: '2rem',
                      color: '#333',
                      margin: '0 0 15px',
                      lineHeight: '1.3'
                    }}>
                      {product.name}
                    </h2>
                    <p style={{
                      fontSize: '1.1rem',
                      color: '#666',
                      margin: '0 0 20px',
                      lineHeight: '1.6'
                    }}>
                      {product.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: '#8B7355'
                      }}>
                        ₦{product.price.toLocaleString()}
                      </span>
                      <Link
                        to="/products"
                        style={{
                          padding: '12px 30px',
                          background: '#8B7355',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: '500',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#6d5a43'}
                        onMouseLeave={(e) => e.target.style.background = '#8B7355'}
                      >
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#fff'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.9)'}
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#fff'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.9)'}
          >
            →
          </button>

          {/* Slide Indicators */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 10
          }}>
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentSlide === index ? '#8B7355' : 'rgba(139,115,85,0.3)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 10
            }}
          >
            {isAutoPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
        </section>
      )}

      {/* ===== WELCOME SECTION ===== */}
      <section style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <img
          src="/logo.png"
          alt="Luxvira Scents Logo"
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            marginBottom: '30px'
          }}
        />
        <h1 style={{ color: '#8B7355', fontSize: '2.5rem', marginBottom: '20px' }}>
          Welcome to Luxvira Scents
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
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
            🛍️ Shop Now
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
        
        <div style={{ marginTop: '60px', padding: '30px', background: '#FFF9F5', borderRadius: '12px' }}>
          <h2 style={{ color: '#8B7355', marginBottom: '15px' }}>✨ Why Choose Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌿</div>
              <h3>Handcrafted</h3>
              <p>Made with care & premium ingredients</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick shipping across Nigeria</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💯</div>
              <h3>Quality Guaranteed</h3>
              <p>100% satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
