# 详情页 SEO + 设计优化（P0 实施轮）

> 审计依据：`business-analysis/growthradar-detail-page-audit.md`（已逐行核对源码确认）
> 目标文件：`src/app/domain/[domain]/page.tsx`（378 行，SSG）
> 数据规模：`public/data/featured-details.json` —— 911 个详情页，全部静态生成

---

## 开发流程状态

| 阶段               | 状态 | 完成时间   | 备注                                  |
| ------------------ | ---- | ---------- | ------------------------------------- |
| 1. 创建计划        | ✅   | 2026-07-31 | 已锁定 P0/P1/P2 范围                  |
| 2. 完成 PRD        | ✅   | 2026-07-31 | 本文档                                |
| 3. 编写代码        | ✅   | 2026-07-31 | P0-1 ~ P0-4 已实现（data-server / SiteFooter / page.tsx / 首页） |
| 4. 自测 + 代码检查 | ✅   | 2026-07-31 | tsc 通过；build 934 页；脱敏 grep 干净；抽样薄页/满血页验证通过 |
| 5. 部署 + 标记完成 | ⏳   | -          | 待部署到 Vercel                       |

---

## 需求描述

**背景**：GrowthRadar 详情页 `/domain/[domain]` 是站点 911 个落地页的主体，承担主要长尾流量承接。经代码级核对（以源码为准，审计文档的字数结论已被证伪）：

- **内容现实（已修正）**：满血页（4 字段齐全）共 850/911 个，**词数 mean=167 / median=171 / max=215，0 个页面达到 300 词**，仅 21 个达到 200 词。即内容**客观偏薄（均值约 170 词）**，并非审计原文所称"满血页约 300+ 词"。缺 description 的条目共 61 个，其中 alive 仍被收录的 59 个，仅靠 summary 支撑（summary 词数 min=9 / max=15 / mean=12 / median=12，**约 12 词，非审计所称约 30 词**）。
- **结构与设计缺口（审计与代码一致）**：
  - 详情页只渲染 `<Header/> + <main>`，**无 footer**（首页有完整 footer 于 `src/app/page.tsx` L95–143）；
  - 仅有 `← Leaderboard` 单条返回链接，**无任何同类/相关站点推荐**（#1 SEO 缺口）；
  - 薄条目各 section 被 `&&` 跳过，Hero 之下近乎空白，**无空态兜底**；
  - noindex 阈值 `!description && status!==alive` 过松，59 个薄页仍被收录；
  - 结构化数据有 `BreadcrumbList`，但页面只显示返回链接，**无可见面包屑**且 schema 缺 category 层级。

**目标**：本轮（P0）聚焦**结构 / 内链 / footer / 空态 / 面包屑**——这是设计审计正确指认的投入产出比最高的修复点。内容篇幅本身的扩张（FAQ、站点预览图）作为 P1 单独立项，**本轮不展开**，也**不声称内容已足够厚**。

**价值**：
- 补齐全站跨页一致性（footer），恢复详情页丢失的分类内链 + E-E-A-T 信任信号；
- "相关站点" rail 补全 4 层内链图的最后一环（详情页 → 同分类详情页），提升停留时长与抓取覆盖；
- 收紧 noindex + 空态兜底，消除薄内容收录风险与"真·空页面"观感；
- 可见面包屑与 schema 对齐，改善导航与富结果一致性。

---

## 用户故事

**角色**：独立创始人 / 寻找可复刻机会的研究者

- **故事 1**：作为研究者，我希望在看完一个站点分析后能直接看到"同类可对比的站点"，以便横向比较、延长停留，而不必返回首页重新筛选。
- **故事 2**：作为研究者，我希望详情页底部有分类入口和信任链接（About/Privacy/Terms），以便快速回到目录、并对站点可信度有信心。
- **故事 3**：作为研究者，我希望看到「首页 › 分类 › 当前站点」的面包屑轨迹，以便随时回到所属分类或首页。
- **故事 4**：作为站点运营者，我希望缺描述的薄页**不被收录**、且页面有"信息整理中"兜底而非空白，以保护抓取预算与用户体验。
- **故事 5（SEO 爬虫视角）**：作为爬虫，我希望详情页有指向同分类其他详情页的静态内链、可见面包屑与对齐的 `BreadcrumbList` schema，以便建立主题集群与正确层级。

---

## 功能需求

### 1. P0（本轮实施 —— 必须可落地）

- [ ] **P0-1 抽出共用 `SiteFooter` 组件，详情页复用**

  - 合并首页 footer 的能力（分类入口 nav + 信任链接 nav + 声明文案 + © 年份），抽成 `src/components/SiteFooter.tsx`（Server Component，无交互；`CookieSettingsButton` 保留）。
  - 详情页 `DomainPage` 在 `</main>` 之后渲染 `<SiteFooter/>`，补齐跨页一致性、分类内链、E-E-A-T 信任链接。
  - 首页 `page.tsx` 同步改为复用 `<SiteFooter/>`（保持视觉一致；其 footer 内容与现有一致，避免重复维护）。
  - 验收：详情页与首页底部渲染相同的 footer；footer 含分类入口（链接到 `/category/[cat]`）+ About/Privacy/Terms + Cookie 设置 + © 年份。

- [ ] **P0-2 "相关站点"推荐 rail**

  - 在详情页正文之后、footer 之前，新增「Related {CategoryPlural}」推荐区，渲染同分类的其他站点卡片（**N=4–6，排除自身**），每张卡片链接到对应 `/domain/[domain]`。
  - 数据来源：在 `src/lib/data-server.ts` 新增 server-only helper `getRelatedByCategory(domain, category, limit)`（见技术实现）。沿用 `getByCategory()` 已有的 score-desc 排序。
  - 卡片采用轻量样式（favicon + domain + summary 一行 + 小评分环），与列表卡视觉同源但更紧凑；链接为静态 `<Link>`（SSG 可抓取）。
  - **边界**：分类下可用条目 < N 时按实际数量渲染；为 0（自身是分类内唯一）时整块不渲染（不留空标题）。
  - 验收：rail 显示 4–6 个同分类、排除自身的站点；分类过小时优雅降级；0 个时不渲染该区块。

- [ ] **P0-3 收紧 noindex + 薄页空态兜底**

  - noindex 阈值由 `!description && status!=="alive"` 改为 **`!description`**：缺描述即 `noindex,follow`（无论存活状态）。
  - 当 `!description`（薄页）时，正文区给出可见的空态兜底（替代各 section 被 `&&` 跳过后的近空白页）：一个居中卡片，文案如「We're still analyzing **{domain}** — 详细解读整理中」，并引导返回分类或首页。
  - 验收：缺 description 的页面 `robots` 为 `index:false,follow:true`；这些页面正文不再近空白，显示空态兜底卡片。

- [ ] **P0-4 可见面包屑 + schema 对齐**

  - 在页面顶部（Hero 头卡上方、返回链接位置）渲染可见面包屑：**Home › {CategoryPlural} › {domain}**，每段为可点击 `<Link>`（Home→`/`、Category→`/category/[cat]`、domain 为当前页不可点击文本）。
  - 同步更新 `BreadcrumbList` JSON-LD 的 `itemListElement` 为 3 段：position 1 = Home(`/`)、position 2 = Category(`/category/[cat]`)、position 3 = 当前 domain。**可见轨迹与 schema 位置一致**。
  - 边界：当 `detail.category` 缺失时，schema 退化为 2 段（Home › domain），可见面包屑省略 Category 段。
  - 验收：页面可见面包屑存在且层级与 `BreadcrumbList` schema 的 position 一致。

### 2. P1（spec 但延后 —— 下一轮）

> 本轮**不实现**，仅记录范围：

- [ ] **H1 / 副标题 / 视觉层级强化**：H1 改为 `{Domain} — {Subcategory}` 或加描述性副标题；H1 字号由 `text-xl`(20px) 提升至约 28px；Section 标题由 `text-text-muted` 12px 提权为 `text-text-primary` 14–15px；Hero 头卡与正文 Section 做视觉差异化（如 Hero 更强阴影/边框/底色）。
- [ ] **FAQ 段落 + `FAQPage` JSON-LD**：补充 "What is {domain}?" / "Is {domain} free?" / "{domain} alternatives" 三类问答，输出 `FAQPage` schema 以获取富结果。
- [ ] **站点截图/预览图占位**：若数据管线支持截图字段，在 Hero 区增加预览图位以提升信息密度（同时可用于动态 OG）。

> 注：以上三项旨在提升**内容篇幅与信息密度**（修正后的事实是满血页均值仅约 170 词），属于内容扩张范畴，单独立项评估，不在本轮 P0 内。

### 3. P2（spec，延后）

- [ ] **动态 OG 图**：通过 `src/app/domain/[domain]/opengraph-image.tsx` 生成「域名 + 评分 + 分类」图，替换全站通用的 `/og.png`。
- [ ] **offers 修正**：当前 `offers: { price:"0", USD }` 对全部 911 个站点硬编码（实测 business_model **全部为 saas**，故问题为"对所有人都硬编码"而非"对部分付费站点错误"）。建议在 business_model 多样化前**直接省略 offers 字段**，或待字段多样化后按模型条件渲染。
- [ ] **外链 `rel` 收紧**：`Visit site ↗` 外链由 `noopener noreferrer` 增加 `nofollow sponsored`（目录站编辑型外链合规）。
- [ ] **新鲜度信号**：详情页复用列表卡的 `NEW` 药丸（`isNew(first_seen, 7)`）与首页的 "Updated …" eyebrow。

### 4. 边界情况

| 场景                                       | 预期行为                                              | 处理方式                                                                    |
| ------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| 缺 description 的薄页（61 个）             | noindex；正文显示空态兜底卡片                         | P0-3 阈值改 `!description`；渲染兜底卡片                                    |
| 分类下仅自身（无其他可推荐）               | "相关站点" rail 整块不渲染                            | `getRelatedByCategory` 返回 `[]` 时页面跳过该区块，不留空标题               |
| 分类下可用条目 < N（如仅 2 个）            | 按实际数量渲染（2 张）                                | helper 返回全部可用，由页面 `slice`；不足 N 不补占位                        |
| `detail.category` 缺失                     | 面包屑省略 Category 段；schema 退化为 2 段            | 条件渲染；schema itemListElement 动态构建                                   |
| 非收录域名（不在 featured set）            | 404（保持现状）                                       | `dynamicParams=false` + `getDetail` 返回 null → `notFound()`                |
| 域名含特殊字符（需 URL 编码）              | 内链/面包屑正确编码                                   | 全程 `encodeURIComponent`（与现状一致）                                     |

### 5. 性能要求

| 指标                 | 要求                            | 验证方法                                  |
| -------------------- | ------------------------------- | ----------------------------------------- |
| 构建产物页数         | 仍为 ~911 个详情页              | `next build` 输出核对                     |
| 构建耗时增量         | 可忽略（仅多读一次 featured.json） | 对比构建日志                              |
| 详情页 HTML 体积增量 | 小幅（footer + rail + 面包屑）  | 抽样对比产物 HTML 大小                    |
| 客户端 JS            | 0 增量（全部 Server Component） | 构建产物无新增 client chunk               |

---

## 非功能需求

### 安全要求 / 脱敏（CRITICAL）

- [ ] **不得新增任何检测信号字段**：score_breakdown、dns_richness、page_count、has_pricing_page、payment_provider、internal_links、alive_30d 等一律**不暴露**到前端或 JSON-LD。公开字段仅限：score、LLM 分析字段（summary/description/key_features/target_users/why_interesting/subcategory 等）、survival_status、first_seen、category、business_model、难度/竞争级别。
- [ ] `getRelatedByCategory` 仅复用 `featured.json` 已公开的 `DomainItem` 字段，不读未公开来源。
- [ ] 外链保持 `noopener noreferrer`（P2 再加 `nofollow sponsored`）。

### 可用性要求

- [ ] 支持主流浏览器（Chrome / Firefox / Safari / Edge）与移动端响应式。
- [ ] 面包屑与 rail 在窄屏可换行/纵向堆叠，不破坏布局。
- [ ] 文案对比度沿用 `text-muted #71717a`（~4.6:1，WCAG-AA）；不引入新的低对比文字。

### 兼容性要求

- [ ] 与现有首页/分类页/信任页视觉一致（复用同一 `SiteFooter`）。
- [ ] 不破坏 sitemap（911 详情页不变）、robots、`metadataBase`、canonical。
- [ ] 数据向后兼容：仅读现有 JSON，不改数据结构。

---

## 技术实现

> 全部为 Server Component / 构建时逻辑，**无客户端数据抓取**，遵守 100% SSG 约束。

### 涉及文件

| 文件                                              | 操作   | 说明                                                                                          |
| ------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `src/components/SiteFooter.tsx`                   | 新建   | 共用 footer（分类 nav + 信任链接 + 声明 + ©）。Server Component。                            |
| `src/app/domain/[domain]/page.tsx`                | 修改   | 引入 `SiteFooter`；新增 Related rail、可见面包屑、空态兜底；改 noindex 阈值；更新 BreadcrumbList schema。 |
| `src/app/page.tsx`                                | 修改   | 首页 footer 改为复用 `<SiteFooter/>`（内容等价，消除重复）。                                  |
| `src/lib/data-server.ts`                          | 修改   | 新增 server-only helper `getRelatedByCategory`。                                              |

### data-server helper 签名

```ts
/**
 * 同分类的"相关站点"，供详情页推荐 rail 使用。
 * 复用 getByCategory() 的 score-desc 排序，排除自身，取前 limit 条。
 * Server-only（读 fs）。返回 [] 表示分类内无其他可推荐条目。
 *
 * @param domain    当前域名（排除自身）
 * @param category  分类 slug（来自 detail.category；为空直接返回 []）
 * @param limit     期望数量，默认 6（页面按 4–6 展示）
 */
export async function getRelatedByCategory(
  domain: string,
  category: string | null,
  limit = 6,
): Promise<DomainItem[]>;
```

实现要点：内部调用 `getByCategory(category)`，`filter((it) => it.domain !== domain)`，再 `.slice(0, limit)`。`category` 为 `null` 时直接返回 `[]`。

### JSON-LD 变更（`page.tsx`）

- `BreadcrumbList.itemListElement` 由 2 段改为 **3 段**（含 category）：
  - `{ position: 1, name: "Home", item: SITE_ORIGIN + "/" }`
  - `{ position: 2, name: categoryPlural(category), item: SITE_ORIGIN + "/category/" + category }`（仅当 `detail.category` 存在）
  - `{ position: 3, name: domain, item: canonical }`
  - category 缺失时为 2 段（position 1 Home、position 2 domain）。
- `SoftwareApplication` 本轮**不变**（offers 修正属 P2）。
- 不新增 `FAQPage`（属 P1）。

### noindex 阈值变更（`generateMetadata`，约 L55）

```ts
// 旧：const thin = !detail?.description && detail?.survival_status !== "alive";
const thin = !detail?.description; // 缺描述即不收录（无论存活）
```

### 空态兜底（`DetailBody`）

- 当 `!detail.description` 时，跳过原有"逐 section 条件渲染"导致的近空白，改为渲染一个居中兜底卡片：
  - 文案：「We're still analyzing **{domain}** — 详细解读整理中。」
  - 引导链接：返回分类（`/category/[cat]`，若 category 存在）或首页。
- 其余结构（面包屑、Hero、Related rail、footer）照常渲染。

### 可见面包屑（`DetailBody` 顶部）

- 替换/扩展现有 `← Leaderboard` 返回链接位置为面包屑组件：`Home › {CategoryPlural} › {domain}`。
- 使用 `categoryPlural()`（来自 `src/lib/categories.ts`）生成可读分类名。

### Related rail（`DetailBody` 正文后）

- `DomainPage` 内 `await getRelatedByCategory(domain, detail.category, 6)`，传入 `DetailBody`。
- 渲染紧凑卡片列表（favicon + domain + summary 截断 + 小评分环），每张 `<Link to="/domain/[domain]">`。
- 数量为 0 时不渲染整块。

### SSG / 脱敏 约束确认

- 所有数据访问通过 `data-server.ts`（server-only，`fs`），不进 client bundle。
- `generateStaticParams` 不变，仍生成全部 911 个域名；`dynamicParams=false` 不变。
- 不新增任何脱敏字段到前端或 JSON-LD（见非功能需求）。

---

## 验收标准

### 功能验收

- [ ] **P0-1**：详情页与首页底部均渲染 `<SiteFooter/>`，含分类入口（指向 `/category/[cat]`）、About/Privacy/Terms、Cookie 设置、© 年份。
- [ ] **P0-2**：详情页存在「Related {CategoryPlural}」rail，展示 **4–6 个同分类、排除自身**的站点卡片；分类过小时按实际数量降级；为 0 时整块不渲染。
- [ ] **P0-3**：缺 description 的页面（61 个）`robots` 为 `index:false,follow:true`（无论 survival_status）；这些页面正文显示空态兜底卡片而非近空白。
- [ ] **P0-4**：页面可见面包屑「Home › {Category} › {domain}」存在，且层级与 `BreadcrumbList` JSON-LD 的 `position` 一致（含 category 时 3 段，缺失时 2 段）。

### 性能验收

- [ ] `next build` 仍生成约 **911** 个详情静态页（数量不变）。
- [ ] 无新增 client-side JS chunk（全部 Server Component）。
- [ ] 构建耗时增量可忽略。

### 安全 / 脱敏验收

- [ ] 详情页 HTML 与 JSON-LD 中**未出现**任何脱敏字段（score_breakdown / dns_richness / page_count / has_pricing_page / payment_provider / internal_links / alive_30d 等）。
- [ ] `getRelatedByCategory` 仅返回 `DomainItem` 公开字段。

### 兼容性验收

- [ ] sitemap（911 详情页）、robots、canonical、`metadataBase` 均未受影响。
- [ ] 桌面/移动端布局正常，面包屑与 rail 窄屏可堆叠。

---

## UI/UX 设计

### 详情页布局（P0 后）

```
┌──────────────────────────────────────────────┐
│                  Header                       │
├──────────────────────────────────────────────┤
│  Home › AI Tools › example.com        ← 可见面包屑（P0-4）
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ [fav] example.com  [AI Tool]   (score)  │ │  ← Hero 头卡（不变）
│  │        subcat / summary                 │ │
│  │        difficulty · competition         │ │
│  │  ─────────────────────────────────────  │ │
│  │  [ Visit site ↗ ]      Discovered …     │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  [What it does] [Core features] … Details     │  ← 正文 sections（满血页）
│   或                                          │
│  ┌─────────────────────────────────────────┐ │
│  │   We're still analyzing example.com —   │ │  ← 薄页空态兜底（P0-3）
│  │   详细解读整理中。  [回到分类]           │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  Related AI Tools                             │  ← 相关站点 rail（P0-2）
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ fav  │ │ fav  │ │ fav  │ │ fav  │  (4–6) │
│  │domain│ │domain│ │domain│ │domain│         │
│  │summary  │summary│summary│summary         │
│  └──────┘ └──────┘ └──────┘ └──────┘         │
├──────────────────────────────────────────────┤
│  GrowthRadar surfaces …（声明）               │  ← SiteFooter（P0-1）
│  Browse by category: AI Tools · SaaS · … All→ │
│  About · Privacy · Terms · Cookie Settings    │
│  © 2026 GrowthRadar                           │
└──────────────────────────────────────────────┘
```

### 交互流程

1. 用户从首页/分类页点击进入详情页。
2. 顶部可见面包屑标明所处位置（Home › Category › Domain），任一段可点击回溯。
3. 阅读 Hero + 正文（满血页）或看到空态兜底（薄页）。
4. 滚至 Related rail，可横向跳转同类站点（延长停留、强化内链）。
5. 页脚提供分类入口与信任链接，可回到目录或了解站点。

### 状态设计

- **Full（满血页）**：面包屑 + Hero + 全 sections + Related rail + footer。
- **Thin（薄页，缺 description）**：面包屑 + Hero + 空态兜底卡片 + Related rail（若有）+ footer；`noindex`。
- **No-related（分类内无其他）**：省略 Related rail，其余不变。

---

## 测试计划

### 单元测试

- [ ] `getRelatedByCategory(domain, category, limit)`：
  - 正确排除自身；
  - 返回条目数 ≤ limit；
  - `category=null` 返回 `[]`；
  - 分类内仅自身时返回 `[]`。
- [ ] noindex 阈值：`!description` → thin=true（无论 alive/dead）；有 description → thin=false。

### 集成测试

- [ ] 详情页渲染：满血页含全部 sections + Related rail + SiteFooter。
- [ ] 薄页渲染：空态兜底卡片出现，无近空白。
- [ ] `BreadcrumbList` schema `position` 与可见面包屑一致（3 段 / 2 段两种情况）。

### E2E / 构建验收

- [ ] `next build` 成功，生成 ~911 详情页 + 分类页 + 信任页 + 首页。
- [ ] 抽样打开 1 个满血页、1 个薄页、1 个小分类页，人工核对布局与链接。
- [ ] 桌面 + 移动视口下 footer / 面包屑 / rail 不溢出。

### 脱敏回归

- [ ] grep 产物 HTML：无 `score_breakdown` / `dns_richness` / `page_count` / `payment_provider` / `internal_links` / `alive_30d` 等字段。

---

## 风险评估

| 风险                                            | 影响 | 应对措施                                                                                 |
| ----------------------------------------------- | ---- | ---------------------------------------------------------------------------------------- |
| 首页改用 `SiteFooter` 后视觉微变                | 低   | 保持 footer 内容与现有一致；构建后人工比对首页截图。                                     |
| Related rail 在极小分类下排版稀疏               | 低   | 数量 < N 按实际渲染；为 0 不渲染整块。                                                   |
| noindex 收紧后收录量下降（59 个薄页移出索引）   | 低   | 这些页面本就内容极薄（~12 词 summary），移出索引利于抓取预算与整体质量。                 |
| 内链数量增加导致 HTML 体积上升                  | 低   | 仅每页 +4–6 条静态链接，增量可忽略；抽样核对产物大小。                                   |
| 误暴露脱敏字段                                  | 高   | helper 仅读 `DomainItem` 公开字段；验收含 grep 产物回归。                                |
| 内容仍偏薄（均值 ~170 词）未被本轮解决          | 中   | 本轮聚焦结构/内链/空态（最高 ROI）；内容扩张（FAQ/预览）列为 P1 单独立项，不谎称已厚。   |

---

## 变更历史

| 日期       | 版本   | 变更内容                                                                                            | 作者 |
| ---------- | ------ | --------------------------------------------------------------------------------------------------- | ---- |
| 2026-07-31 | v1.0.0 | 初版 PRD；锁定 P0-1~P0-4（footer/related rail/noindex 收紧/可见面包屑）；P1/P2 记录范围延后。       | AI   |

---

**文档状态**: ✅ P0 已实现并通过自测（待部署）
**优先级**: P0（本轮）
**预计完成**: 2026-08（P1/P2 单独立项）
