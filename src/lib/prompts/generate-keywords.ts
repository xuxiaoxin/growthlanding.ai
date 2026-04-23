import type { ParsedProduct, Trend } from "@/types";

export function buildGenerateKeywordsPrompt(product: ParsedProduct, trend: Trend): string {
  return `You are an SEO keyword expert. Generate long-tail keywords for a product, targeting a specific trend.

## Product Information
- Product Name: ${product.productName}
- Category: ${product.category}
- Core Keywords: ${product.coreKeywords.join(", ")}
- User Intent: ${product.userIntent}

## Trend
- Name: ${trend.name}
- Description: ${trend.description}
- Search Intent: ${trend.searchIntent}

## Requirements
1. Generate 3-5 long-tail keywords
2. Keywords should combine the trend and product
3. Keywords should have actual search demand
4. Suitable for SEO page titles

Please return the result in JSON format:
{
  "keywords": [
    {
      "keyword": "Long-tail keyword",
      "searchVolume": "Estimated search volume (Low/Medium/High)",
      "difficulty": "SEO difficulty (Low/Medium/High)",
      "intent": "Search intent"
    }
  ]
}

Return ONLY valid JSON, no other text.`;
}

export const GENERATE_KEYWORDS_SYSTEM = "You are an SEO keyword research expert skilled at generating high-conversion long-tail keywords for products. Always return valid JSON format.";
