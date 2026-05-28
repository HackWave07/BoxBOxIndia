export const getSafeApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
  
  // Force production backend if we are not on localhost
  if (!isLocal) {
    if (!envUrl || envUrl.includes('localhost')) {
      return 'https://boxboxindia.onrender.com/api';
    }
  }
  
  return envUrl || 'http://localhost:5000/api';
};

const apiUrl = getSafeApiUrl();

const getApiOrigin = () => {
  try {
    return new URL(apiUrl).origin;
  } catch {
    return '';
  }
};

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (/^(?:https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const origin = getApiOrigin();
    return origin ? `${origin}${url}` : url;
  }
  return url;
};
