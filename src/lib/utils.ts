export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative path
    return '';
  }

  if (process.env.VERCEL_URL) {
    // Reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    // Reference for custom domain
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Assume localhost
  return `http://localhost:${process.env.PORT || 3000}`;
} 