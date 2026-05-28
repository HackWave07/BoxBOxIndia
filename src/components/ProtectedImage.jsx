import React from 'react';

const stopImageAction = (event) => {
  event.preventDefault();
};

export default function ProtectedImage({
  src,
  alt,
  className,
  style,
  imgStyle,
  onError,
  onMouseEnter,
  onMouseLeave
}) {
  return (
    <div
      className={`protected-image-wrap${className ? ` ${className}` : ''}`}
      onContextMenu={stopImageAction}
      onDragStart={stopImageAction}
      onTouchStart={(event) => {
        event.currentTarget.style.WebkitTouchCallout = 'none';
      }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
        ...style
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable="false"
        onContextMenu={stopImageAction}
        onDragStart={stopImageAction}
        onError={onError}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          ...imgStyle
        }}
      />
    </div>
  );
}

export { stopImageAction };
