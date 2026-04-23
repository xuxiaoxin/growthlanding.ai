import { NextRequest } from "next/server";
import { callDeepSeekJSON } from "@/lib/deepseek";
import { buildParseProductPrompt, PARSE_PRODUCT_SYSTEM } from "@/lib/prompts/parse-product";
import { buildSelectTrendsPrompt, SELECT_TRENDS_SYSTEM } from "@/lib/prompts/select-trends";
import { buildGenerateKeywordsPrompt, GENERATE_KEYWORDS_SYSTEM } from "@/lib/prompts/generate-keywords";
import { buildGeneratePagePrompt, GENERATE_PAGE_SYSTEM } from "@/lib/prompts/generate-page";
import { TREND_POOL } from "@/lib/data/trend-pool";
import type { ParsedProduct, Trend, LandingPage, SSEEvent } from "@/types";

export const maxDuration = 300; // 5 minutes timeout

interface SelectedTrend {
  name: string;
  description: string;
  searchIntent: string;
  relevance: string;
}

interface KeywordResult {
  keyword: string;
  searchVolume: string;
  difficulty: string;
  intent: string;
}

interface PageResult {
  title: string;
  metaDescription: string;
  slug: string;
  h1: string;
  content: string;
  faq: Array<{ question: string; answer: string }>;
  cta: { text: string; url: string };
}

function createSSEMessage(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { description, url, targetAudience } = body;

  if (!description || description.trim().length < 5) {
    return new Response(JSON.stringify({ error: "Please enter a product description with at least 5 characters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    const sendEvent = async (event: SSEEvent) => {
      await writer.write(encoder.encode(createSSEMessage(event)));
    };

    try {
      // Step 1: Parse product
      await sendEvent({ type: "parsing", data: {}, message: "🧠 Analyzing your product..." });

      const parsedProduct = await callDeepSeekJSON<ParsedProduct>(
        buildParseProductPrompt(description, url, targetAudience),
        PARSE_PRODUCT_SYSTEM
      );

      await sendEvent({
        type: "parsed",
        data: { product: parsedProduct },
        message: `✅ Product analyzed: ${parsedProduct.productName}`,
      });

      // Step 2: Select trends
      await sendEvent({ type: "selecting_trends", data: {}, message: "🔥 Finding relevant trends..." });

      const trendsResult = await callDeepSeekJSON<{ trends: SelectedTrend[] }>(
        buildSelectTrendsPrompt(parsedProduct, TREND_POOL),
        SELECT_TRENDS_SYSTEM
      );

      const selectedTrends: Trend[] = trendsResult.trends.slice(0, 10).map((t) => ({
        name: t.name,
        description: t.description,
        searchIntent: t.searchIntent,
      }));

      await sendEvent({
        type: "trends_selected",
        data: { trends: selectedTrends },
        message: `✅ Found ${selectedTrends.length} relevant trends`,
      });

      // Step 3: Generate keywords + pages
      const pages: LandingPage[] = [];

      for (let i = 0; i < selectedTrends.length; i++) {
        const trend = selectedTrends[i];

        // Generate keywords
        await sendEvent({
          type: "generating_keywords",
          data: { trendIndex: i, trendName: trend.name },
          message: `🔍 Generating keywords for "${trend.name}"...`,
        });

        const keywordsResult = await callDeepSeekJSON<{ keywords: KeywordResult[] }>(
          buildGenerateKeywordsPrompt(parsedProduct, trend),
          GENERATE_KEYWORDS_SYSTEM
        );

        const mainKeyword = keywordsResult.keywords[0]?.keyword || `${trend.name} ${parsedProduct.coreKeywords[0] || ""}`;

        await sendEvent({
          type: "keywords_generated",
          data: { trendIndex: i, keyword: mainKeyword },
          message: `✅ Generated keyword: ${mainKeyword}`,
        });

        // Generate page
        await sendEvent({
          type: "generating_page",
          data: { pageIndex: i + 1, total: selectedTrends.length },
          message: `📝 Creating page ${i + 1}/${selectedTrends.length}...`,
        });

        const pageResult = await callDeepSeekJSON<PageResult>(
          buildGeneratePagePrompt(parsedProduct, trend.name, mainKeyword, url),
          GENERATE_PAGE_SYSTEM
        );

        const page: LandingPage = {
          id: `page-${i + 1}`,
          trend,
          keyword: mainKeyword,
          title: pageResult.title,
          metaDescription: pageResult.metaDescription,
          slug: pageResult.slug,
          h1: pageResult.h1,
          content: pageResult.content,
          faq: pageResult.faq,
          cta: pageResult.cta,
        };

        pages.push(page);

        await sendEvent({
          type: "page_generated",
          data: { pageIndex: i + 1, page },
          message: `✅ Page ${i + 1} completed: ${page.title}`,
        });
      }

      // Complete
      await sendEvent({
        type: "complete",
        data: {
          pages,
          parsedProduct,
          trends: selectedTrends,
          totalKeywords: pages.length,
        },
        message: "🎉 All 10 SEO pages generated!",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed";
      await sendEvent({ type: "error", data: {}, message });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
