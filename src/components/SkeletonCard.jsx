import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
      <div className="card-media-frame" style={{ background: 'var(--border)', width: '100%', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
        <div style={{ background: 'var(--border)', height: '14px', width: '40%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        <div style={{ background: 'var(--border)', height: '20px', width: '80%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        <div style={{ background: 'var(--border)', height: '14px', width: '30%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginTop: 'auto' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div style={{ background: 'var(--border)', height: '24px', width: '40%', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ background: 'var(--border)', height: '36px', width: '80px', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.2; }
          100% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
};

export default SkeletonCard;
