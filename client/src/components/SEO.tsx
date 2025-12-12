import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    // Update canonical link
    // Only update if we are not on localhost/dev
    if (window.location.hostname !== 'localhost') {
      let link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute('href', window.location.href);
      }
    }
  }, [title, description]);

  return null;
}
