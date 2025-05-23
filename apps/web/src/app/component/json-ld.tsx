import type { ProductPost } from "../types";

interface JsonLdProps {
  posts: ProductPost[];
}

export function JsonLd({ posts }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OGHUNT",
    description: "Product Hunt with ZERO AI Slop which uses AI to filter out AI projects",
    url: "https://oghunt.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://oghunt.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const productListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: post.name,
        description: post.description,
        url: post.url,
        applicationCategory: "Product",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }}
      />
    </>
  );
}
