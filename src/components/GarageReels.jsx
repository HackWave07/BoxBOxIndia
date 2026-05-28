import React, { useEffect, useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

const reels = [
  {
    src: '/assets/reels/reel-1.mp4',
    title: 'Thar Rim Upgrade',
    label: 'Upgrade'
  },
  {
    src: '/assets/reels/reel-2.mp4',
    title: 'Versys 650 + Pirelli MT60RS',
    label: 'Install'
  },
  {
    src: '/assets/reels/reel-3.mp4',
    title: 'BMW GS310 + Maxxis Maxxplore',
    label: 'Fitment'
  },
  {
    src: '/assets/reels/reel-4.mp4',
    title: 'Benelli TRK 502 Tyre Change',
    label: 'Garage'
  },
  {
    src: '/assets/reels/reel-5.mp4',
    title: 'Live Customer Review',
    label: 'Review'
  }
];

const ReelCard = ({ reel }) => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const muteWhenAnotherReelActivates = (event) => {
      if (event.detail?.src === reel.src) return;
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
      setIsMuted(true);
    };

    window.addEventListener('boxbox-garage-audio', muteWhenAnotherReelActivates);
    return () => window.removeEventListener('boxbox-garage-audio', muteWhenAnotherReelActivates);
  }, [reel.src]);

  const publishActiveAudio = () => {
    window.dispatchEvent(new CustomEvent('boxbox-garage-audio', { detail: { src: reel.src } }));
  };

  const setVideoMuted = (muted) => {
    if (!videoRef.current || hasError) return;
    videoRef.current.muted = muted;
    setIsMuted(muted);
    if (!muted) publishActiveAudio();
  };

  const playVideo = ({ withSound = false } = {}) => {
    if (!videoRef.current || hasError) return;

    if (withSound) {
      publishActiveAudio();
      videoRef.current.muted = false;
      setIsMuted(false);
    }

    videoRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      });
  };

  const pauseVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.muted = true;
    setIsPlaying(false);
    setIsMuted(true);
  };

  const toggleVideo = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo({ withSound: !isMuted });
    }
  };

  const toggleSound = (event) => {
    event.stopPropagation();
    const nextMuted = !isMuted;
    setVideoMuted(nextMuted);
    if (!nextMuted && videoRef.current?.paused) {
      playVideo({ withSound: true });
    }
  };

  return (
    <article
      className="garage-reel-card"
      onMouseEnter={() => playVideo({ withSound: true })}
      onMouseLeave={pauseVideo}
    >
      <div
        role="button"
        tabIndex={0}
        className="garage-reel-media"
        onClick={toggleVideo}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleVideo();
          }
        }}
        aria-label={`Play ${reel.title}`}
      >
        {hasError ? (
          <div className="garage-reel-fallback">
            <Play size={28} />
          </div>
        ) : (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setHasError(true)}
          >
            <source src={reel.src} type="video/mp4" />
          </video>
        )}
        {!isPlaying && !hasError && (
          <span className="garage-reel-play">
            <Play size={18} fill="currentColor" />
          </span>
        )}
        {!hasError && (
          <button
            type="button"
            className="garage-reel-sound"
            aria-label={isMuted ? `Unmute ${reel.title}` : `Mute ${reel.title}`}
            onClick={toggleSound}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      <div className="garage-reel-copy">
        <span>{reel.label}</span>
        <h3 className="font-condensed">{reel.title}</h3>
      </div>
    </article>
  );
};

export default function GarageReels() {
  return (
    <section className="home-section garage-reels-section" aria-labelledby="garage-reels-title">
      <div className="section-full">
        <div className="garage-reels-heading">
          <div>
            <p>From the BoxBox floor</p>
            <h2 id="garage-reels-title" className="font-condensed">BoxBox Garage</h2>
          </div>
          <span>Real installs, upgrades, and rider stories.</span>
        </div>

        <div className="garage-reels-track" aria-label="BoxBox garage reel videos">
          {reels.map((reel) => (
            <ReelCard key={reel.src} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
