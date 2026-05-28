# SEO & Performance Guide

## Production Checklist

- Verify the canonical domain is `https://hilal-najem-portfolio.pages.dev/` in Cloudflare Pages.
- Submit `https://hilal-najem-portfolio.pages.dev/sitemap.xml` to Google Search Console.
- Confirm the Open Graph image resolves on LinkedIn, X, and Facebook.
- Keep `robots.txt` and `sitemap.xml` in the root directory.

## Performance Recommendations

1. Keep CSS and JS minimal; defer non-critical scripts.
2. Use `loading="lazy"` for project images and any below-the-fold media.
3. Serve static assets through Cloudflare CDN with cache-control headers.
4. Keep fonts preloaded and use `display=swap`.

## Caching Recommendations

- `Cache-Control: public, max-age=31536000, immutable` for hashed assets.
- `Cache-Control: public, max-age=3600` for HTML.

## Google Search Console Setup

1. Add property `https://hilal-najem-portfolio.pages.dev/`.
2. Submit sitemap URL.
3. Verify indexing for the homepage.
4. Review Core Web Vitals and coverage.

## LinkedIn / Social Preview Notes

- Use absolute OG image URLs.
- Keep title under ~60 characters and description under ~160 characters.
- Use the same canonical URL across all social previews.
