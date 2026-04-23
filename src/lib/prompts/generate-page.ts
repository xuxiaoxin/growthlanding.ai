import type { ParsedProduct, LandingPage } from "@/types";

export function buildGeneratePagePrompt(
  product: ParsedProduct,
  trendName: string,
  keyword: string,
  productUrl?: string
): string {
  return `You are an SEO content expert. Generate an SEO Landing Page for a product.

## Product Information
- Product Name: ${product.productName}
- Category: ${product.category}
- Key Features: ${product.keyFeatures?.join(", ") || product.coreKeywords.join(", ")}
- Target Audience: ${product.targetAudience || "General users"}
${productUrl ? `- Product URL: ${productUrl}` : ""}

## SEO Keywords
- Target Keyword: ${keyword}
- Related Trend: ${trendName}

## Requirements
Generate an SEO page of 1000-1500 words with the following structure:

1. **Title**: Include the keyword and year (2026), engaging and clickable
2. **Meta Description**: Under 160 characters, include keyword, with CTA appeal
3. **URL Slug**: English hyphenated format
4. **H1**: Include the keyword
5. **Content Structure**:
   - Introduction (connect with trend ${trendName}, create resonance)
   - Problem Analysis (pain points users face)
   - Solution (naturally introduce ${product.productName})
   - Product Advantages (why choose this product)
   - FAQ (3-5 common questions and answers)
6. **CTA**: Guide users to try the product

Please return the result in JSON format:
{
  "title": "SEO title",
  "metaDescription": "Meta description",
  "slug": "url-slug",
  "h1": "H1 heading",
  "content": "HTML content (use h2/h3/p/ul/li tags)",
  "faq": [
    {"question": "Question", "answer": "Answer"}
  ],
  "cta": {
    "text": "CTA button text",
    "url": "${productUrl || "#"}"
  }
}

Return ONLY valid JSON, no other text.`;
}

export const GENERATE_PAGE_SYSTEM = "You are a professional SEO content writer specializing in high-conversion Landing Pages. Content should be natural and fluent, avoiding overly promotional tone. Always return valid JSON format.";
