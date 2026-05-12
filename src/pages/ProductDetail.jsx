import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Star, Shield, Info, ShoppingCart, Loader2, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import StickyPurchaseBar from '../components/StickyPurchaseBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TyreSizeDrawer from '../components/TyreSizeDrawer';
import { resolveMediaUrl } from '../utils/media';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');
  const [activeImage, setActiveImage] = useState('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const [showSticky, setShowSticky] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const heroRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct({ ...data, id: data._id });
        setActiveImage(resolveMediaUrl(data?.images?.[0] || data?.image || ''));
        setSelectedSize(data?.tyreSize || data?.size || '');

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
        console.error('Error fetching product detail', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 300) {
        // Past the product section — show on scroll DOWN, hide on scroll UP
        if (currentScrollY > lastScrollY.current) {
          setShowSticky(true);  // scrolling down
        } else {
          setShowSticky(false); // scrolling up
        }
      } else {
        setShowSticky(false); // near the top — always hide
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader2 size={48} className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  }
  if (!product) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text)' }}>
        Loading product...
      </div>
    );
  }

  const gallery = (product?.images && product.images.length > 0 ? product.images : [product?.image || '']).map(resolveMediaUrl);

  // Mock Reviews
  const mockReviews = [
    { id: 1, user: "Karan S.", rating: 5, date: "October 12, 2023", text: "Exceptional grip on wet tarmac. Instills massive confidence in corners." },
    { id: 2, user: "Rohan M.", rating: 4, date: "September 05, 2023", text: "Great quality for the price. The durability is holding up nicely after 5000kms." },
    { id: 3, user: "Arjun V.", rating: 5, date: "August 21, 2023", text: "Exactly as described. Fast shipping and the tyre feels completely premium." }
  ];

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="section-full" style={{ paddingTop: '40px', paddingBottom: showSticky ? '90px' : '60px', transition: 'padding-bottom 0.3s ease' }}>
      <div ref={heroRef} className="responsive-two-col" style={{ gap: '24px', marginBottom: '80px', alignItems: 'start' }}>

        {/* LEFT: IMAGE GALLERY */}
        <div style={{ position: 'sticky', top: '120px' }}>
          <div
            className="glass-panel"
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
              minHeight: '320px',
              height: 'min(500px, 65vw)',
              overflow: 'hidden',
              cursor: 'zoom-in'
            }}
          >
            <img
              src={activeImage || 'https://via.placeholder.com/500?text=No+Image'}
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/500?text=No+Image"; }}
              alt={product?.name || 'Product Image'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                transition: 'opacity 0.3s ease',
                opacity: zoomPos.show ? 0 : 1
              }}
            />

            {/* Inner Zoom Layer */}
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

          {/* Thumbnails */}
          <div className="scroll-x-mobile" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
            {gallery.map((img, i) => (
              <div
                key={i}
                className="glass-panel"
                onClick={() => setActiveImage(img)}
                style={{
                  flex: '0 0 100px',
                  height: '100px',
                  cursor: 'pointer',
                  border: activeImage === img ? '2px solid var(--text)' : '1px solid var(--border)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  transform: activeImage === img ? 'scale(1.05)' : 'scale(1)',
                  zIndex: activeImage === img ? 1 : 0
                }}
              >
                <img
                  src={img || 'https://via.placeholder.com/500?text=No+Image'}
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/500?text=No+Image"; }}
                  alt={`thumbnail-${i}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: activeImage === img ? 1 : 0.6,
                    transition: 'all 0.3s'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px', lineHeight: '1.1' }}>{product.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', marginBottom: '24px' }}>{product.brand}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star fill="var(--text)" color="var(--text)" size={18} />
              <Star fill="var(--text)" color="var(--text)" size={18} />
              <Star fill="var(--text)" color="var(--text)" size={18} />
              <Star fill="var(--text)" color="var(--text)" size={18} />
              <Star fill="transparent" color="var(--text)" size={18} />
              <span style={{ fontWeight: '700', marginLeft: '8px' }}>{product?.rating || 0}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>({product?.reviews || 0} verified reviews)</span>
          </div>

          <p style={{ fontSize: '36px', fontWeight: '800', marginBottom: '32px' }}>₹{product?.price?.toLocaleString() || '0'}</p>

          <div style={{ padding: '24px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '32px' }}>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '16px', marginBottom: '24px' }}>
              {product?.description}
            </p>

            {/* Quick Specs inline */}
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                borderColor: 'var(--text)',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--text)';
                e.currentTarget.style.color = 'var(--bg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              {selectedSize} <ChevronRight size={16} />
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Select a different size configuration for this model.
            </p>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', padding: '18px', fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', transition: 'transform 0.2s', transform: 'scale(1)' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => {
              if (product) {
                addToCart(product);
                addToast(`${product?.name || 'Item'} secured in cart`, 'success');
              }
            }}
          >
            <ShoppingCart size={20} />
            Secure Add to Cart
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', flexWrap: 'wrap' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} /> Secure Checkout</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={16} /> Free Delivery</p>
          </div>
        </div>
      </div>

      {/* TABS (Specs, Compatibility, Reviews) */}
      <div style={{ marginBottom: '80px', marginTop: '40px' }}>
        <div className="scroll-x-mobile" style={{ display: 'flex', gap: '40px', borderBottom: '1px solid var(--border)', marginBottom: '40px', overflowX: 'auto', paddingBottom: '16px' }}>
          {['specs', 'compatibility', 'reviews'].map(tab => (
            <button
              key={tab}
              style={{ padding: '0', background: 'none', border: 'none', fontWeight: activeTab === tab ? '800' : '600', color: activeTab === tab ? 'var(--text)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--text)' : '2px solid transparent', cursor: 'pointer', fontSize: '18px', textTransform: 'capitalize', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'specs' ? 'Technical Specs' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'specs' && (
          <div className="glass-panel table-wrap" style={{ padding: '32px', maxWidth: '800px', background: 'var(--bg2)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[['Brand', product?.brand], ['Category', product?.category], ['Size', product?.tyreSize || product?.size || 'N/A'], ['Grip Level', product?.specs?.grip || 'Standard'], ['Estimated Mileage', product?.specs?.mileage || 'Omitted'], ['Durability Class', product?.specs?.durability || 'Standard']].map(([key, val], i) => (
                  <tr key={key} style={{ borderBottom: i === 5 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '20px 0', color: 'var(--text-muted)', width: '40%', fontSize: '15px' }}>{key}</td>
                    <td style={{ padding: '20px 0', fontWeight: '700', fontSize: '16px' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'compatibility' && (
          <div className="glass-panel table-wrap" style={{ padding: '32px', maxWidth: '800px', background: 'var(--bg2)' }}>
            {product?.compatibility && product?.compatibility?.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <th style={{ paddingBottom: '16px', fontWeight: '600' }}>Vehicle Type</th>
                    <th style={{ paddingBottom: '16px', fontWeight: '600' }}>Make</th>
                    <th style={{ paddingBottom: '16px', fontWeight: '600' }}>Model</th>
                    <th style={{ paddingBottom: '16px', fontWeight: '600' }}>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {product?.compatibility?.map((c, i) => (
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
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Universal Fitment / No specific vehicle mapped.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', padding: '32px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1' }}>{product?.rating || 0}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                  <Star fill="var(--text)" color="var(--text)" size={16} />
                  <Star fill="var(--text)" color="var(--text)" size={16} />
                  <Star fill="var(--text)" color="var(--text)" size={16} />
                  <Star fill="var(--text)" color="var(--text)" size={16} />
                  <Star fill="transparent" color="var(--text)" size={16} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>Based on {product?.reviews || 0} reviews</p>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Verified Purchase Quality</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>All our reviews adhere to strict authenticity guidelines. Buyers must purchase and verify shipping limits before establishing a review onto our premium platform.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {mockReviews.map(rev => (
                <div key={rev.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--text)', color: 'var(--bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800' }}>
                        {rev.user.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700' }}>{rev.user}</p>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                          {Array(5).fill().map((_, index) => (
                            <Star key={index} fill={index < rev.rating ? "var(--text)" : "transparent"} color="var(--text)" size={12} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{rev.date}</span>
                  </div>
                  <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.6', paddingLeft: '52px' }}>
                    {rev.text}
                  </p>
                </div>
              ))}
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

      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
