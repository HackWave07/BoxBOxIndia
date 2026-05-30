import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, X, Loader2, FileSpreadsheet } from 'lucide-react';
import BulkImportModal from '../components/BulkImportModal';
import { useToast } from '../context/ToastContext';
import { resolveMediaUrl } from '../utils/media';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { addToast } = useToast();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const initialForm = {
    type: 'tyre', name: '', brand: '', price: '', category: '', tyreSize: '', stock: '', images: [''], description: '',
    grip: '', durability: '', mileage: '', featuredOnHome: false, vehicleCategory: ''
  };
  const [form, setForm] = useState(initialForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products`);

      let productsArray = [];
      if (Array.isArray(data)) productsArray = data;
      else if (data && Array.isArray(data.data)) productsArray = data.data;

      setProducts(productsArray);
    } catch (error) {
      console.error('Failed to fetch products', error);
      addToast('Failed to connect to backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product._id || product.id);
      setForm({
        type: product.type || 'tyre',
        name: product.name || '',
        brand: product.brand || '',
        price: product.price || '',
        category: product.category || '',
        tyreSize: product.tyreSize || product.size || '',
        stock: product.stock || '',
        images: product.images && product.images.length > 0 ? product.images : [product.image || ''],
        description: product.description || '',
        featuredOnHome: Boolean(product.featuredOnHome),
        grip: product.specs?.grip || '',
        durability: product.specs?.durability || '',
        mileage: product.specs?.mileage || '',
        vehicleCategory: product.vehicleCategory || ''
      });
    } else {
      setEditingId(null);
      setForm(initialForm);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredImages = form.images.filter(img => img.trim() !== '');
    if (filteredImages.length === 0) {
      addToast('Upload at least one product image.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        type: form.type, name: form.name, brand: form.brand, price: Number(form.price), category: form.category,
        tyreSize: form.type === 'tyre' ? form.tyreSize : 'N/A', stock: Number(form.stock),
        images: filteredImages,
        description: form.description,
        featuredOnHome: Boolean(form.featuredOnHome),
        specs: { grip: form.grip, durability: form.durability, mileage: form.mileage },
        vehicleCategory: form.type === 'tyre' ? form.vehicleCategory : ''
      };

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast('Product updated successfully.', 'success');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        addToast('Product created successfully.', 'success');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Persistence failed', error);
      addToast('Failed to save product.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Product deleted successfully.', 'success');
      setProducts(products.filter(p => (p._id || p.id) !== id));
    } catch (error) {
      console.error(error);
      addToast('Delete operation failed.', 'error');
    }
  };

  const handleImageChange = (index, value) => {
    setForm((currentForm) => {
      const newImages = [...currentForm.images];
      newImages[index] = value;
      return { ...currentForm, images: newImages };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        addToast('Only image files are allowed.', 'error');
        return;
      }
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (Array.isArray(data.urls) && data.urls.length > 0) {
        setForm((currentForm) => ({
          ...currentForm,
          images: [...currentForm.images.filter(img => img.trim() !== ''), ...data.urls]
        }));
        addToast(`${data.urls.length} image(s) uploaded successfully.`, 'success');
      } else {
        addToast('No uploaded image URLs were returned.', 'error');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      addToast(error.response?.data?.error || 'Failed to upload images.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addImageField = () => setForm((currentForm) => ({ ...currentForm, images: [...currentForm.images, ''] }));
  const removeImageField = (index) => {
    setForm((currentForm) => ({
      ...currentForm,
      images: currentForm.images.length > 1
        ? currentForm.images.filter((_, i) => i !== index)
        : currentForm.images
    }));
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)',
    color: 'var(--text)', borderRadius: '6px', outline: 'none', marginBottom: '16px', fontSize: '14px'
  };

  return (
    <div className="container-narrow" style={{ minHeight: '80vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Manage stock, pricing, and entries intelligently.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/admin/orders" style={{ padding: '10px 20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            Orders
          </a>
          <button onClick={() => setImportModalOpen(true)} style={{ padding: '10px 20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={16} /> Bulk Import
          </button>
          <button onClick={() => openModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> New Product
          </button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'none', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '6px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><Loader2 size={40} className="animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>The database is currently empty.</p>
        </div>
      ) : (
        <div className="glass-panel table-wrap" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Product</th>
                <th style={{ padding: '16px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>SKU / Brand</th>
                <th style={{ padding: '16px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Price</th>
                <th style={{ padding: '16px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Stock</th>
                <th style={{ padding: '16px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id || p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                      <img src={resolveMediaUrl(p.images?.[0] || p.image)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600' }}>{p.name}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{p.tyreSize || p.size}</p>
                      {p.featuredOnHome && (
                        <p style={{ fontSize: '11px', color: 'var(--text)', fontWeight: '800', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Featured on homepage</p>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{p.brand}</td>
                  <td style={{ padding: '16px', fontWeight: '600' }}>₹{p.price.toLocaleString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', background: p.stock > 10 ? 'rgba(0,200,80,0.1)' : 'rgba(255,60,60,0.1)', color: p.stock > 10 ? '#00c853' : '#ff4444', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {p.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => openModal(p)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '16px' }} title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p._id || p.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg2)', padding: '32px', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="responsive-two-col" style={{ gap: '24px' }}>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>Basic Details</h4>
                  <input type="text" name="name" placeholder="Product Name *" value={form.name} onChange={handleChange} required style={inputStyle} />
                  <input type="text" name="brand" placeholder="Brand *" value={form.brand} onChange={handleChange} required style={inputStyle} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input type="number" name="price" placeholder="Price (₹) *" value={form.price} onChange={handleChange} required style={inputStyle} />
                    <input type="number" name="stock" placeholder="Stock Level *" value={form.stock} onChange={handleChange} required style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Product Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ ...inputStyle, padding: '8px 14px' }}
                    />
                    {uploading && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>
                        <Loader2 size={14} className="animate-spin" />
                        Uploading images...
                      </div>
                    )}
                    {form.images.map((img, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          placeholder={`Image URL ${idx + 1}`}
                          value={img}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0 }}
                        />
                        {form.images.length > 1 && (
                          <button type="button" onClick={() => removeImageField(idx)} style={{ background: 'rgba(255,60,60,0.1)', color: '#ff4444', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer' }}><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addImageField} style={{ background: 'var(--bg)', border: '1px dashed var(--border)', color: 'var(--text)', padding: '8px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                      + Add Perspective URL
                    </button>
                  </div>

                  <textarea name="description" placeholder="Product Description *" value={form.description} onChange={handleChange} required style={{ ...inputStyle, height: '120px', resize: 'vertical' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>
                    <input
                      type="checkbox"
                      name="featuredOnHome"
                      checked={Boolean(form.featuredOnHome)}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--text)' }}
                    />
                    Feature this product on homepage
                  </label>
                </div>

                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>Specifications</h4>
                  <select name="type" value={form.type} onChange={handleChange} required style={inputStyle}>
                    <option value="" disabled>Select Product Type *</option>
                    <option value="tyre">Tyre</option>
                    <option value="part">Automotive Part</option>
                  </select>
                  {form.type === 'tyre' && (
                    <select
                      name="vehicleCategory"
                      value={form.vehicleCategory}
                      onChange={(e) => setForm({ ...form, vehicleCategory: e.target.value, category: '' })}
                      required
                      style={inputStyle}
                    >
                      <option value="" disabled>Vehicle Type *</option>
                      <option value="car">Car Tyre</option>
                      <option value="motorcycle">Motorcycle Tyre</option>
                    </select>
                  )}
                  <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
                    <option value="" disabled>Select Category *</option>
                    {form.type === 'part' ? (
                      <>
                        <option value="Brakes">Brakes</option>
                        <option value="Suspension">Suspension</option>
                        <option value="Chain & Sprockets">Chain & Sprockets</option>
                        <option value="Engine Upgrades">Engine Upgrades</option>
                        <option value="Exhaust Systems">Exhaust Systems</option>
                        <option value="Accessories">Accessories</option>
                      </>
                    ) : form.vehicleCategory === 'car' ? (
                      <>
                        <option value="Hatchback / Small Cars">Hatchback / Small Cars</option>
                        <option value="Sedan / Premium">Sedan / Premium</option>
                        <option value="SUV / MUV">SUV / MUV</option>
                        <option value="EV / Electric">EV / Electric</option>
                        <option value="Performance / Sports">Performance / Sports</option>
                        <option value="All-Terrain / Offroad">All-Terrain / Offroad</option>
                        <option value="Track / Street">Track / Street</option>
                      </>
                    ) : form.vehicleCategory === 'motorcycle' ? (
                      <>
                        <option value="ADV & Dual Sport">ADV & Dual Sport</option>
                        <option value="Cruiser">Cruiser</option>
                        <option value="Sport / Touring">Sport / Touring</option>
                        <option value="Super Sports">Super Sports</option>
                        <option value="Motocross">Motocross</option>
                        <option value="Vintage">Vintage</option>
                        <option value="Scooter">Scooter</option>
                      </>
                    ) : (
                      <option value="" disabled>Select vehicle type first</option>
                    )}
                  </select>
                  {form.type === 'tyre' && (
                    <input type="text" name="tyreSize" placeholder="Tyre Size (e.g., 245/35 R20) *" value={form.tyreSize} onChange={handleChange} required style={inputStyle} />
                  )}
                  <input type="text" name="grip" placeholder="Grip Rating (e.g., 90%)" value={form.grip} onChange={handleChange} style={inputStyle} />
                  <input type="text" name="durability" placeholder="Durability Level" value={form.durability} onChange={handleChange} style={inputStyle} />
                  <input type="text" name="mileage" placeholder="Estimated Mileage (e.g., 50,000 km)" value={form.mileage} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '12px 32px' }}>
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Save Changes' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {importModalOpen && (
        <BulkImportModal
          onClose={() => setImportModalOpen(false)}
          onImportDone={fetchProducts}
        />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
