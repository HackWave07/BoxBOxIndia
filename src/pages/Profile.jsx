import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, MapPin, LogOut, Package, Edit2, Plus, Trash2, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout, updateProfile, updateAddresses } = useAuth();
  const { addToast } = useToast();
  
  // Modals state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      addToast('Profile updated successfully', 'success');
      setShowEditProfile(false);
    } catch (error) {
      addToast('Failed to update profile', 'error');
    }
  };

  const handleAddressAction = async (e) => {
    e.preventDefault();
    try {
      const newAddresses = [...(user.addresses || [])];
      if (editingAddressIndex !== null) {
        newAddresses[editingAddressIndex] = addressForm;
      } else {
        newAddresses.push(addressForm);
      }
      await updateAddresses(newAddresses);
      addToast(editingAddressIndex !== null ? 'Address updated' : 'Address added', 'success');
      setShowAddressModal(false);
      setEditingAddressIndex(null);
    } catch (error) {
      addToast('Failed to save address', 'error');
    }
  };

  const deleteAddress = async (index) => {
    try {
      const newAddresses = user.addresses.filter((_, i) => i !== index);
      await updateAddresses(newAddresses);
      addToast('Address deleted', 'success');
    } catch (error) {
      addToast('Failed to delete address', 'error');
    }
  };

  const openAddressModal = (index = null) => {
    if (index !== null) {
      setAddressForm(user.addresses[index]);
      setEditingAddressIndex(index);
    } else {
      setAddressForm({ fullName: user.name, phone: user.phone || '', addressLine: '', city: '', state: '', pincode: '', landmark: '' });
      setEditingAddressIndex(null);
    }
    setShowAddressModal(true);
  };

  return (
    <div className="section-full" style={{ padding: '60px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <h1 className="font-condensed" style={{ fontSize: '42px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>My Account</h1>
          <button onClick={logout} className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '10px 20px' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* COLUMN 1: Profile & Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* User Info Card */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--text)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', lineHeight: 1.2 }}>{user.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'capitalize', fontWeight: '600' }}>{user.role} Partner</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text)' }}>
                  <div style={{ color: 'var(--text-muted)' }}><Mail size={18} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Email</span>
                    <span style={{ fontWeight: '600' }}>{user.email}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text)' }}>
                  <div style={{ color: 'var(--text-muted)' }}><Phone size={18} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Phone</span>
                    <span style={{ fontWeight: '600' }}>{user.phone || 'Not added'}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => { setProfileForm({ name: user.name, phone: user.phone || '' }); setShowEditProfile(true); }}
                className="btn-secondary" 
                style={{ width: '100%', marginTop: '32px', justifyContent: 'center', padding: '14px' }}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            </div>

            {/* My Orders Quick Link */}
            <Link to="/my-orders" className="glass-panel animate-lift" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', textDecoration: 'none' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--bg2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
                <Package size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text)' }}>My Orders</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track and manage your tyre orders</p>
              </div>
            </Link>
          </div>

          {/* COLUMN 2: Addresses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Saved Addresses</h3>
              <button 
                onClick={() => openAddressModal()}
                style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700' }}
              >
                <Plus size={18} /> Add New
              </button>
            </div>

            {(!user.addresses || user.addresses.length === 0) ? (
              <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', border: '2px dashed var(--border)', background: 'none' }}>
                <MapPin size={40} style={{ color: 'var(--border)', marginBottom: '16px' }} />
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>You haven't saved any addresses yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontWeight: '800', marginBottom: '4px' }}>{addr.fullName}</h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>{addr.phone}</p>
                      <p style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.5 }}>
                        {addr.addressLine}<br />
                        {addr.city}, {addr.state} - {addr.pincode}<br />
                        {addr.landmark && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Landmark: {addr.landmark}</span>}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openAddressModal(idx)} className="btn-icon" style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg2)', color: 'var(--text)' }}><Edit2 size={16} /></button>
                      <button onClick={() => deleteAddress(idx)} className="btn-icon" style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg2)', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- MODALS (Simulated with fixed overlays) --- */}

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div onClick={() => setShowEditProfile(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
            <form onSubmit={handleUpdateProfile} className="glass-panel" style={{ position: 'relative', width: '100%', maxWidth: '440px', padding: '40px', zIndex: 1, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>Edit Profile</h3>
                <X size={24} onClick={() => setShowEditProfile(false)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="btn-secondary" 
                    value={profileForm.name} 
                    onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                    style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} 
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="btn-secondary" 
                    value={profileForm.phone} 
                    onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                    style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} 
                    required 
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '12px', justifyContent: 'center' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address Modal */}
        {showAddressModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div onClick={() => setShowAddressModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
            <form onSubmit={handleAddressAction} className="glass-panel" style={{ position: 'relative', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '40px', zIndex: 1, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>{editingAddressIndex !== null ? 'Edit Address' : 'New Address'}</h3>
                <X size={24} onClick={() => setShowAddressModal(false)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Recipient Name</label>
                  <input type="text" className="btn-secondary" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} required />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input type="tel" className="btn-secondary" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} required />
                </div>
                <div>
                  <label className="form-label">Pincode</label>
                  <input type="text" className="btn-secondary" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Address Line</label>
                  <input type="text" className="btn-secondary" value={addressForm.addressLine} onChange={e => setAddressForm({...addressForm, addressLine: e.target.value})} style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} required />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input type="text" className="btn-secondary" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} required />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input type="text" className="btn-secondary" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Landmark (Optional)</label>
                  <input type="text" className="btn-secondary" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} style={{ width: '100%', textAlign: 'left', background: 'var(--input-bg)', padding: '14px' }} />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '32px', justifyContent: 'center' }}>
                {editingAddressIndex !== null ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
