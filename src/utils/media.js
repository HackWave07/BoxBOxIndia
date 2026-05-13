export const getSafeApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction && (!envUrl || envUrl.includes('localhost'))) {
    return 'https://boxboxindia.onrender.com/api';
  }
  
  return envUrl || '';
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
