// Homepage slideshow with category filtering
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductSlider({ category }) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch published products by category
    const fetchProducts = async () => {
      try {
        const url = category 
          ? `/api/products?category=${category}`
          : '/api/products';
        const res = await fetch(import.meta.env.VITE_API_URL + url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, [category]);
  
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % products.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
  };
  
  if (products.length === 0) return <div className="slider-empty">No products found</div>;
  
  const product = products[currentIndex];
  
  return (
    <div className="product-slider">
      <button className="slider-btn prev" onClick={prevSlide}>❮</button>
      
      <div className="slide-content">
        <img 
          src={product.image_url} 
          alt={product.name}
          onClick={() => navigate(`/product/${product.id}`)}
          className="slide-image"
        />
        
        <div className="slide-info">
          <h3>{product.name}</h3>
          <p className="slide-description">{product.description}</p>
          <p className="slide-price">${product.price.toFixed(2)}</p>
          
          <div className="slide-actions">
            <button 
              className="btn-add-cart"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button 
              className="btn-details"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <button className="slider-btn next" onClick={nextSlide}>❯</button>
      
      <div className="slide-indicators">
        {products.map((_, idx) => (
          <span
            key={idx}
            className={`indicator ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
