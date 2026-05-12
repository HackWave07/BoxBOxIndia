const apiUrl = import.meta.env.VITE_API_URL || '';

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
