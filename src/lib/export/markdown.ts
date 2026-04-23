import type { LandingPage } from "@/types";

export function pageToMarkdown(page: LandingPage): string {
  const faqSection = page.faq
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  return `# ${page.h1}

> ${page.metaDescription}

${page.content.replace(/<[^>]+>/g, "").trim()}

---

## FAQ

${faqSection}

---

[${page.cta.text}](${page.cta.url})

---
<!-- SEO Meta
Title: ${page.title}
Description: ${page.metaDescription}
Slug: /${page.slug}
-->
`;
}
