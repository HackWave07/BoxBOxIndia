/**
 * Dynamically updates document titles, meta descriptions, canonical URLs,
 * and handles JSON-LD schema injections for SEO ranking optimization.
 */
export function updateSEO({ title, description, canonical, schema }) {
  // 1. Title tag
  if (title) {
    document.title = title;
  }

  // 2. Meta description tag
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }

  // 3. Canonical URL tag
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.rel = 'canonical';
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.href = canonical || (window.location.origin + window.location.pathname);

  // 4. Schema JSON-LD Script tag
  const existingSchema = document.getElementById('boxbox-schema-jsonld');
  if (existingSchema) {
    existingSchema.remove();
  }
  if (schema) {
    const script = document.createElement('script');
    script.id = 'boxbox-schema-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
