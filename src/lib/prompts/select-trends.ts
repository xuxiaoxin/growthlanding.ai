import type { ParsedProduct, Trend } from "@/types";

export function buildSelectTrendsPrompt(product: ParsedProduct, trendPool: Trend[]): string {
  const trendList = trendPool.map((t, i) => `${i + 1}. ${t.name}: ${t.description}`).join("\n");

  return `You are an SEO trend analysis expert. Based on the product information, select the 10 most relevant trends from the following trend pool.

## Product Information
- Product Name: ${product.productName}
- Category: ${product.category}
- Core Keywords: ${product.coreKeywords.join(", ")}
- User Intent: ${product.userIntent}

## Trend Pool
${trendList}

## Requirements
1. Select the 10 trends most relevant to the product
2. Describe the search intent for each trend
3. Prioritize trends with current search popularity

Please return the result in JSON format:
{
  "trends": [
    {
      "name": "Trend name",
      "description": "Brief description of the trend",
      "searchIntent": "User search intent for this trend",
      "relevance": "Why this trend is relevant to the product"
    }
  ]
}

Return ONLY valid JSON, no other text.`;
}

export const SELECT_TRENDS_SYSTEM = "You are an SEO trend analysis expert skilled at identifying high-search-volume trending topics relevant to products. Always return valid JSON format.";
