import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://safargo.com";
const DEFAULT_IMAGE = `${BASE_URL}/logo512.png`;
const SITE_NAME = "SafarGo";

/**
 * Reusable SEO Component for SafarGo
 * Dynamically updates document title, meta tags, OpenGraph, Twitter Cards, Canonical links, and JSON-LD schema per route.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noindex = false,
  schema = null,
}) {
  const location = useLocation();
  const currentPath = canonicalPath || location.pathname;
  const canonicalUrl = `${BASE_URL}${currentPath === "/" ? "" : currentPath}`;

  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Intercity Carpooling & Ridesharing in India`;

  const metaDescription =
    description ||
    "SafarGo is India's trusted intercity carpooling and ridesharing platform. Find and offer carpool rides between cities, split fuel costs, and travel comfortably with verified drivers and passengers.";

  const keywordsString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords ||
      "carpooling India, intercity carpool, ridesharing app, share empty car seats, split fuel costs, car sharing, verified drivers, SafarGo";

  const robotsDirective = noindex
    ? "noindex, nofollow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to set or create link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Primary Meta Tags
    setMetaTag("name", "title", fullTitle);
    setMetaTag("name", "description", metaDescription);
    setMetaTag("name", "keywords", keywordsString);
    setMetaTag("name", "robots", robotsDirective);
    setLinkTag("canonical", canonicalUrl);

    // 3. Open Graph Tags
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", metaDescription);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:locale", "en_IN");

    // 4. Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:url", canonicalUrl);
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", metaDescription);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Page-Specific Schema.org JSON-LD
    let scriptTag = document.getElementById("page-schema-jsonld");
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "page-schema-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on route transition
      const schemaElement = document.getElementById("page-schema-jsonld");
      if (schemaElement) schemaElement.remove();
    };
  }, [
    fullTitle,
    metaDescription,
    keywordsString,
    robotsDirective,
    canonicalUrl,
    ogType,
    ogImage,
    schema,
  ]);

  return null;
}
