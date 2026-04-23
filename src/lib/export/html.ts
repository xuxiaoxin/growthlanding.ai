import type { LandingPage } from "@/types";

export function pageToHTML(page: LandingPage): string {
  const faqHTML = page.faq
    .map(
      (item) => `
  <div class="faq-item">
    <h3>${item.question}</h3>
    <p>${item.answer}</p>
  </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.metaDescription}">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1a1a1a; line-height: 1.8; }
    h1 { font-size: 2rem; margin-bottom: 1.5rem; }
    h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; }
    h3 { font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    .faq-item { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .cta { text-align: center; margin: 2rem 0; }
    .cta a { display: inline-block; background: #4F46E5; color: white; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .cta a:hover { background: #4338CA; }
  </style>
</head>
<body>
  <h1>${page.h1}</h1>

  ${page.content}

  <h2>Frequently Asked Questions</h2>
  ${faqHTML}

  <div class="cta">
    <a href="${page.cta.url}">${page.cta.text}</a>
  </div>
</body>
</html>`;
}
