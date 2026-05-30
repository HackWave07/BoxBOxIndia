import React, { useState, useRef } from 'react';
import axios from 'axios';
import { X, Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STATUS_COLORS = {
  imported:  { bg: 'rgba(0,200,80,0.1)',  text: '#00c853' },
  duplicate: { bg: 'rgba(255,160,0,0.12)', text: '#ff9800' },
  failed:    { bg: 'rgba(255,60,60,0.1)',  text: '#ff4444' },
};

const StatusIcon = ({ status }) => {
  if (status === 'imported')  return <CheckCircle  size={14} color="#00c853" />;
  if (status === 'duplicate') return <AlertCircle  size={14} color="#ff9800" />;
  return                              <XCircle      size={14} color="#ff4444" />;
};

export default function BulkImportModal({ onClose, onImportDone }) {
  const { token } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (ext !== 'xlsx' && ext !== 'csv') {
      setError('Only .xlsx and .csv files are accepted.');
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
    setReport(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first.'); return; }
    setUploading(true);
    setError('');
    setReport(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/import/products`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
      );
      setReport(data);
      if (data.imported > 0) {
        addToast(`${data.imported} product(s) imported successfully.`, 'success');
        if (onImportDone) onImportDone();
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Import failed. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) onClose();
  };

  // Close on Escape
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [uploading]);

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'var(--bg)',
    border: '1px solid var(--border)', color: 'var(--text)',
    borderRadius: '6px', outline: 'none', fontSize: '14px',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bulk Import Products"
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
      />

      {/* Modal */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg2)',
          borderRadius: '12px',
          padding: 'clamp(20px, 5vw, 32px)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Bulk Import Products</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Upload an .xlsx or .csv file to import products in bulk.</p>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            aria-label="Close"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: uploading ? 'not-allowed' : 'pointer', padding: '4px', flexShrink: 0 }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Expected columns info */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '4px' }}>Expected columns (case-sensitive headers):</strong>
          Product Name · Brand · Vehicle Type · Category · Tyre Size · Load Index · Speed Rating · MRP (₹) · Selling Price (₹) · Stock · Warranty · Estimated Mileage · Vehicle Compatibility · SEO Title · SEO Description · Product Description · Featured
          <br />
          <em style={{ marginTop: '4px', display: 'block' }}>Optional image columns: image1, image2, image3, image4 (Cloudinary URLs)</em>
        </div>

        {/* File drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${file ? 'var(--text)' : 'var(--border)'}`,
            borderRadius: '8px',
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: file ? 'var(--bg)' : 'transparent',
            transition: 'border-color 0.2s, background 0.2s',
            marginBottom: '16px',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <FileSpreadsheet size={32} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
          {file ? (
            <>
              <p style={{ fontWeight: '700', color: 'var(--text)', fontSize: '15px' }}>{file.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: '600', color: 'var(--text)', fontSize: '14px' }}>Drop file here or click to browse</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Accepts .xlsx and .csv · Max 20 MB</p>
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', color: '#ff4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={14} />
            {error}
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary"
          style={{ width: '100%', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', opacity: (!file || uploading) ? 0.6 : 1, cursor: (!file || uploading) ? 'not-allowed' : 'pointer' }}
        >
          {uploading ? <><Loader2 size={18} className="animate-spin" /> Importing…</> : <><Upload size={18} /> Import Products</>}
        </button>

        {/* Report */}
        {report && (
          <div style={{ marginTop: '24px' }}>
            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: 'Total Rows', value: report.total, color: 'var(--text)' },
                { label: 'Imported', value: report.imported, color: '#00c853' },
                { label: 'Duplicates', value: report.duplicates, color: '#ff9800' },
                { label: 'Failed', value: report.failed, color: '#ff4444' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: '800', color, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Row-by-row results table */}
            {report.results.length > 0 && (
              <>
                <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Row Details</p>
                <div style={{ maxHeight: '260px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', position: 'sticky', top: 0 }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>#Row</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Product</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>Status</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.results.map((r, idx) => {
                        const colors = STATUS_COLORS[r.status] || STATUS_COLORS.failed;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '9px 12px', color: 'var(--text-muted)' }}>{r.row}</td>
                            <td style={{ padding: '9px 12px', color: 'var(--text)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name || '—'}</td>
                            <td style={{ padding: '9px 12px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: colors.bg, color: colors.text, padding: '2px 8px', borderRadius: '20px', fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                                <StatusIcon status={r.status} />
                                {r.status}
                              </span>
                            </td>
                            <td style={{ padding: '9px 12px', color: 'var(--text-muted)', fontSize: '12px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
