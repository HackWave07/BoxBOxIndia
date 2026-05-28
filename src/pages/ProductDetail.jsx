import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Star, Shield, Info, ShoppingCart, Loader2, CheckCircle2, ChevronRight, ArrowRight, Package, MessageSquare } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import StickyPurchaseBar from '../components/StickyPurchaseBar';
import axios from 'axios';
import TyreSizeDrawer from '../components/TyreSizeDrawer';
import { resolveMediaUrl } from '../utils/media';
import { updateSEO } from '../utils/seo';
import ProtectedImage, { stopImageAction } from '../components/ProtectedImage';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');
  const [activeImage, setActiveImage] = useState('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const [showSticky, setShowSticky] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const heroRef = React.useRef(null);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct({ ...data, id: data._id });
        setActiveImage(resolveMediaUrl(data?.images?.[0] || data?.image || ''));
        setSelectedSize(data?.tyreSize || data?.size || '');

        // Fetch real reviews
        const reviewsRes = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/product/${id}`);
        setReviews(reviewsRes.data);

        // Recommended products
        const recsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        let recsArray = [];
        if (Array.isArray(recsResponse.data)) {
          recsArray = recsResponse.data;
        } else if (recsResponse.data && Array.isArray(recsResponse.data.data)) {
          recsArray = recsResponse.data.data;
        }
        setRecommended(recsArray.filter(p => String(p._id) !== String(id)).slice(0, 4));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product data', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 300) {
        setShowSticky(currentScrollY > lastScrollY.current);
      } else {
        setShowSticky(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (product) {
      const origin = window.location.origin;
      const stockValue = Number(product.stock);
      const isOutOfStock = Number.isFinite(stockValue) ? stockValue <= 0 : false;
      updateSEO({
        title: `${product.brand} ${product.name} Tyre | Buy Online in India | BoxBox India`,
        description: `Buy ${product.brand} ${product.name} high performance tyre online at BoxBox India. Size: ${product.tyreSize || 'All Sizes'} | Category: ${product.category || 'Premium'}. Secure payments & fast delivery in India.`,
        canonical: `${origin}/product/${id}`,
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "@id": `${origin}/product/${id}#product`,
              "name": `${product.brand} ${product.name}`,
              "image": resolveMediaUrl(product.image || ''),
              "description": product.description || `Buy ${product.brand} ${product.name} premium tyre online in India at BoxBox India.`,
              "brand": {
                "@type": "Brand",
                "name": product.brand
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": product.price,
                "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                "url": `${origin}/product/${id}`
              },
              "aggregateRating": product.reviews > 0 ? {
                "@type": "AggregateRating",
                "ratingValue": product.rating || "5.0",
                "reviewCount": product.reviews || "1"
              } : undefined
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": origin
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Products",
                  "item": `${origin}/products`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": product.name,
                  "item": `${origin}/product/${id}`
                }
              ]
            }
          ]
        }
      });
    }
  }, [product, id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to leave a review', 'error');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setReviewLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
        productId: id,
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      addToast('Review submitted successfully!', 'success');
      
      const newCount = (product.reviews || 0) + 1;
      const newRating = ((parseFloat(product.rating || 0) * (product.reviews || 0)) + newReview.rating) / newCount;
      setProduct({ ...product, rating: newRating.toFixed(1), reviews: newCount });
      
    } catch (error) {
      addToast(error.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleBuyNow = () => {
    const stockValue = Number(product?.stock);
    if (Number.isFinite(stockValue) && stockValue <= 0) {
      addToast('This product is currently out of stock', 'error');
      return;
    }
    addToCart(product);
    navigate('/checkout');
  };

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader2 size={48} className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  }

  if (!product) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text)' }}>Product not found</div>;
  }

  const gallery = (product?.images && product.images.length > 0 ? product.images : [product?.image || '']).map(resolveMediaUrl);
  const stockValue = Number(product.stock);
  const isOutOfStock = Number.isFinite(stockValue) ? stockValue <= 0 : false;
  const lowStock = Number.isFinite(stockValue) && stockValue > 0 && stockValue <= 5;
  const whatsappText = encodeURIComponent(`Hi BOXBOX India, I want to enquire about restock availability for ${product.brand} ${product.name}.`);
  const whatsappLink = `https://wa.me/919022229979?text=${whatsappText}`;

  return (
    <div className="section-full" style={{ paddingTop: '40px', paddingBottom: showSticky ? '90px' : '60px', transition: 'padding-bottom 0.3s ease' }}>
      <div ref={heroRef} className="responsive-two-col" style={{ gap: '24px', marginBottom: '80px', alignItems: 'start' }}>
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="product-gallery-container">
          <div
            className="glass-panel product-detail-gallery-main"
            onContextMenu={stopImageAction}
            onDragStart={stopImageAction}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoomPos(prev => ({ ...prev, show: true }))}
            onMouseLeave={() => setZoomPos(prev => ({ ...prev, show: false }))}
            style={{
              position: 'relative',
              padding: '24px',
              marginBottom: '20px',
              background: 'var(--bg2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              cursor: 'zoom-in'
            }}
          >
            <ProtectedImage
              src={activeImage || 'https://via.placeholder.com/500?text=No+Image'}
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/500?text=No+Image"; }}
              alt={product?.name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                opacity: zoomPos.show ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
              imgStyle={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            {zoomPos.show && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${activeImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat',
                borderRadius: '8px',
                pointerEvents: 'none'
              }} />
            )}
          </div>

          <div className="scroll-x-mobile" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
            {gallery.map((img, i) => (
              <div
                key={i}
                className="glass-panel product-detail-thumbnail-item"
                onClick={() => setActiveImage(img)}
                style={{
                  cursor: 'pointer',
                  border: activeImage === img ? '2px solid var(--text)' : '1px solid var(--border)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  transform: activeImage === img ? 'scale(1.05)' : 'scale(1)',
                  zIndex: activeImage === img ? 1 : 0
                }}
              >
                <ProtectedImage
                  src={img}
                  alt={`thumbnail-${i}`}
                  style={{ width: '100%', height: '100%' }}
                  imgStyle={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeImage === img ? 1 : 0.6 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div>
          <h1 className="product-details-title">{product.name}</h1>
          <p className="product-details-brand">{product.brand}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill={i < Math.round(product?.rating || 0) ? "var(--text)" : "transparent"} color="var(--text)" size={18} />
              ))}
              <span style={{ fontWeight: '700', marginLeft: '8px' }}>{product?.rating || 0}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>({product?.reviews || 0} verified reviews)</span>
          </div>

          <p className="product-details-price">₹{product?.price?.toLocaleString() || '0'}</p>
          {isOutOfStock ? (
            <p style={{ color: '#ff4444', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '-20px', marginBottom: '28px' }}>
              Out of Stock
            </p>
          ) : lowStock ? (
            <p style={{ color: '#ff7b00', fontWeight: '800', fontSize: '14px', marginTop: '-20px', marginBottom: '28px' }}>
              Only {product.stock} left
            </p>
          ) : null}

          <div className="product-details-desc-box">
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px', marginBottom: '24px' }}>
              {product?.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {product?.specs?.grip && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--text)" />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Grip: {product.specs.grip}</span>
                </div>
              )}
              {product?.specs?.durability && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--text)" />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Durability: {product.specs.durability}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0', marginBottom: '32px' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Available Size</h4>
            <div
              onClick={() => setIsDrawerOpen(true)}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', borderColor: 'var(--text)', fontWeight: '700', cursor: 'pointer' }}
            >
              {selectedSize} <ChevronRight size={16} />
            </div>
          </div>

          {isOutOfStock ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: '100%', padding: '18px', fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
            >
              <MessageSquare size={20} />
              Enquire on WhatsApp
            </a>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '18px', fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
              onClick={() => {
                addToCart(product);
                addToast(`${product.name} secured in cart`, 'success');
              }}
            >
              <ShoppingCart size={20} />
              Secure Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ marginBottom: '80px', marginTop: '40px' }}>
        <div className="scroll-x-mobile" style={{ display: 'flex', gap: '40px', borderBottom: '1px solid var(--border)', marginBottom: '40px', overflowX: 'auto', paddingBottom: '16px' }}>
          {['specs', 'compatibility', 'parts', 'reviews'].map(tab => (
            <button
              key={tab}
              style={{ padding: '0 0 16px 0', background: 'none', border: 'none', fontWeight: activeTab === tab ? '800' : '600', color: activeTab === tab ? 'var(--text)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--text)' : '2px solid transparent', cursor: 'pointer', fontSize: '18px', textTransform: 'capitalize' }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'specs' ? 'Technical Specs' : tab === 'parts' ? 'Related Parts' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'specs' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Brand', product?.brand],
                  ['Category', product?.category],
                  ['Size', product?.tyreSize || product?.size || 'N/A'],
                  ['Grip Level', product?.specs?.grip || 'Standard'],
                  ['Durability Class', product?.specs?.durability || 'Standard']
                ].map(([key, val], i) => (
                  <tr key={key} style={{ borderBottom: i === 4 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '20px 0', color: 'var(--text-muted)', width: '40%' }}>{key}</td>
                    <td style={{ padding: '20px 0', fontWeight: '700' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'compatibility' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {product?.compatibility && product.compatibility.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <th style={{ paddingBottom: '16px' }}>Vehicle Type</th>
                    <th style={{ paddingBottom: '16px' }}>Make</th>
                    <th style={{ paddingBottom: '16px' }}>Model</th>
                    <th style={{ paddingBottom: '16px' }}>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {product.compatibility.map((c, i) => (
                    <tr key={i} style={{ borderBottom: i === product.compatibility.length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <td style={{ padding: '20px 0', fontWeight: '600' }}>{c.vehicleType}</td>
                      <td style={{ padding: '20px 0', fontWeight: '700' }}>{c.brand}</td>
                      <td style={{ padding: '20px 0' }}>{c.model}</td>
                      <td style={{ padding: '20px 0', color: 'var(--text-muted)' }}>{c.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Info size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Universal Fitment / No specific vehicle mapped.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'parts' && (
          <div style={{ maxWidth: '800px' }}>
            {product?.relatedParts && product.relatedParts.length > 0 ? (
              <div className="responsive-grid" style={{ gap: '20px' }}>
                {product.relatedParts.map(part => (
                  <ProductCard key={part._id} product={{ ...part, id: part._id }} />
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '40px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg2)' }}>
                <Package size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>No specific related parts or accessories recommended for this item.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '800px' }}>
            {/* Rating Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', padding: '32px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1' }}>{product?.rating || 0}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill={i < Math.round(product?.rating || 0) ? "var(--text)" : "transparent"} color="var(--text)" size={16} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>Based on {product?.reviews || 0} reviews</p>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Verified Purchase Quality</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>All reviews are from verified owners. We ensure the highest level of authenticity for our rider community.</p>
              </div>
            </div>

            {/* Review Form */}
            {user ? (
              <div className="glass-panel" style={{ padding: '32px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '48px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Leave a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Rating</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Star fill={star <= newReview.rating ? "var(--text)" : "transparent"} color="var(--text)" size={24} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <textarea
                      required
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience..."
                      style={{ width: '100%', minHeight: '120px', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'inherit' }}
                    />
                  </div>
                  <button type="submit" disabled={reviewLoading} className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                    {reviewLoading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', background: 'var(--bg2)', borderRadius: '12px', marginBottom: '48px', border: '1px dashed var(--border)' }}>
                <p style={{ fontWeight: '600', marginBottom: '16px' }}>Login to leave a review</p>
                <Link to="/login" className="btn-secondary" style={{ display: 'inline-flex', padding: '8px 24px' }}>Login Now</Link>
              </div>
            )}

            {/* Review List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {reviews.length > 0 ? reviews.map(rev => (
                <div key={rev._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--text)', color: 'var(--bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800' }}>
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700' }}>{rev.userName}</p>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} fill={i < rev.rating ? "var(--text)" : "transparent"} color="var(--text)" size={12} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.6', paddingLeft: '52px' }}>{rev.comment}</p>
                </div>
              )) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No reviews yet. Be the first!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RECOMMENDED */}
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Recommended Products</h2>
      <div className="responsive-grid" style={{ gap: '24px' }}>
        {recommended.map(p => (
          <ProductCard key={p._id} product={{ ...p, id: p._id }} />
        ))}
      </div>

      <StickyPurchaseBar
        product={product}
        show={showSticky}
        onAddToCart={() => {
          if (isOutOfStock) return;
          addToCart(product);
          addToast(`${product.name} secured in cart`, 'success');
        }}
        onBuyNow={handleBuyNow}
      />

      <TyreSizeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentProduct={product}
        onSelect={(size) => {
          setIsDrawerOpen(false);
          setSelectedSize(size);
          navigate(`/products?size=${encodeURIComponent(size)}`);
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
