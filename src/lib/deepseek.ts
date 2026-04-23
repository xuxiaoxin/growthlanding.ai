import type { ParsedProduct, Trend, KeywordGroup, LandingPage, Product } from "@/types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

async function callDeepSeek(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        ...(systemPrompt
          ? [{ role: "system" as const, content: systemPrompt }]
          : []),
        { role: "user" as const, content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Streaming call
async function callDeepSeekStream(
  prompt: string,
  systemPrompt?: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        ...(systemPrompt
          ? [{ role: "system" as const, content: systemPrompt }]
          : []),
        { role: "user" as const, content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") break;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices[0]?.delta?.content || "";
        if (content) {
          fullContent += content;
          onChunk?.(content);
        }
      } catch {
        // skip invalid JSON
      }
    }
  }

  return fullContent;
}

export { callDeepSeek, callDeepSeekStream };

// Convenience method: parse JSON result
export async function callDeepSeekJSON<T>(
  prompt: string,
  systemPrompt?: string
): Promise<T> {
  const result = await callDeepSeek(prompt, systemPrompt);
  // Extract JSON block (handle possible markdown code block wrapping)
  const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : result;
  return JSON.parse(jsonStr.trim()) as T;
}
