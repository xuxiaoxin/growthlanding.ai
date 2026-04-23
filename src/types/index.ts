// Product info
export interface Product {
  description: string;
  url?: string;
  targetAudience?: string;
}

// Parsed product result
export interface ParsedProduct {
  category: string;
  coreKeywords: string[];
  userIntent: string;
  productName: string;
  targetAudience?: string;
  keyFeatures?: string[];
  competitors?: string[];
}

// Trend
export interface Trend {
  name: string;
  description: string;
  searchIntent: string;
}

// Keywords
export interface KeywordGroup {
  trend: Trend;
  keywords: string[];
}

// SEO Landing Page
export interface LandingPage {
  id: string;
  trend: Trend;
  keyword: string;
  title: string;
  metaDescription: string;
  slug: string;
  h1: string;
  content: string;
  faq: Array<{ question: string; answer: string }>;
  cta: {
    text: string;
    url: string;
  };
}

// Generation result
export interface GenerateResult {
  id: string;
  product: Product;
  parsedProduct: ParsedProduct;
  trends: Trend[];
  keywordGroups: KeywordGroup[];
  pages: LandingPage[];
}

// SSE Events
export type SSEEventType =
  | "parsing"
  | "parsed"
  | "selecting_trends"
  | "trends_selected"
  | "generating_keywords"
  | "keywords_generated"
  | "generating_page"
  | "page_generated"
  | "complete"
  | "error";

export interface SSEEvent {
  type: SSEEventType;
  data: Record<string, unknown>;
  message: string;
}
