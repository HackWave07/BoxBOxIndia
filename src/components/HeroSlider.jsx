import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { stopImageAction } from './ProtectedImage';

const whatsappText = encodeURIComponent('Hi BoxBoxIndia, I need help finding the right tyre for my vehicle.');
const whatsappUrl = `https://wa.me/919022229979?text=${whatsappText}`;

export default function HeroSlider() {
  return (
    <section
      className="hero-slider-container hero-video-shell"
      onContextMenu={stopImageAction}
      onDragStart={stopImageAction}
      aria-label="BoxBox India premium tyre hero"
    >
      <video
        className="hero-video-media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/assets/videos/hero-video.webm" type="video/webm" />
        <source src="/assets/videos/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="hero-video-overlay" />

      <div className="hero-video-content section-full">
        <p className="hero-video-kicker">Premium performance tyres</p>
        <h1 className="font-condensed hero-slide-title hero-video-title">
          Grip Built For The Drive
        </h1>
        <p className="hero-slide-subtitle hero-video-subtitle">
          Genuine tyres, expert support, and fast delivery for serious riders and drivers.
        </p>
        <div className="hero-video-actions">
          <a
            href="/products?type=tyre"
            className="hero-slide-btn hero-video-btn hero-video-btn-primary"
          >
            Browse Tyres
            <ArrowRight size={17} strokeWidth={2.4} />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-video-btn hero-video-btn-secondary"
            aria-label="Chat with a BoxBox India tyre expert on WhatsApp"
          >
            WhatsApp Expert
            <MessageCircle size={17} strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </section>
  );
}
