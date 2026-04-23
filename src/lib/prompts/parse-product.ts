export function buildParseProductPrompt(description: string, url?: string, targetAudience?: string): string {
  return `You are a product analysis expert. Please analyze the following product description and extract key information.

Product Description: ${description}
${url ? `Product URL: ${url}` : ""}
${targetAudience ? `Target Audience: ${targetAudience}` : ""}

Please return the result in JSON format with the following fields:
{
  "productName": "Short product name",
  "category": "Product category (e.g., AI Tool / Education / SaaS / E-commerce)",
  "coreKeywords": ["keyword1", "keyword2", "keyword3"],
  "userIntent": "One sentence describing the main purpose and use case",
  "targetAudience": "Target user group description",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "competitors": ["competitor1", "competitor2"]
}

Return ONLY valid JSON, no other text.`;
}

export const PARSE_PRODUCT_SYSTEM = "You are a professional product analyst skilled at extracting core product information from brief descriptions. Always return valid JSON format.";
