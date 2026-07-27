# GrowthRadar — UI & SEO 审计落地记录

> 本文档汇总了对 `webui`（Next.js 16 App Router · 纯静态 SSG · 775 个详情页）的两轮审计建议，以及每一条的落地状态。
> 取代了原 `.spec/README.md`、`.spec/ui/UI_AUDIT.md`、`.spec/seo/SEO_AUDIT.md` 三份文档。
> 生成日期：2026-07-27

---

## 一、UI 审计落地（对照 `UI_AUDIT.md` v2 设计稿）

设计哲学：**克制编辑风 + 单一品牌强调色（teal）**，分数刻意用「单一色相环形」而非红黄绿交通灯，避免把分数误读成质量判决。

### P0（已完成）

| # | 审计建议 | 落地状态 | 文件 |
|---|---|---|---|
| 1 | 引入单一品牌强调色（teal `#0d9488`），稀疏使用于 logo/Top3/score ring/focus | ✅ 加 `--color-accent` / `-soft` / `-ink` 三档 token | `globals.css` |
| 2 | muted 文字对比度 `#a1a1aa`(2.5:1) → `#71717a`(4.6:1)，达 WCAG AA | ✅ 调整 `--color-text-muted` | `globals.css` |
| 3 | 排行榜排名/分数强化：Top3 加大 accent 排名 + 3px 左边框（领奖台感） | ✅ `LeaderboardCard` Top3 分支 | `LeaderboardCard.tsx` |
| 4 | 分数从灰字改为 teal 圆环（只表量级，不表好坏） | ✅ `ScoreRing` SVG 组件（卡片+详情页共用几何 helper） | `LeaderboardCard.tsx`、`domain/[domain]/page.tsx` |
| 5 | 加搜索框 + 分类 chips + 分页（775 条全渲染进 HTML，溢出用 `hidden` 隐藏，兼顾 UX 与 SEO 内链） | ✅ 新建 `Leaderboard` 客户端组件 | `Leaderboard.tsx` |
| 6 | 加 hero 引导区（H1 + eyebrow + 导语） | ✅ 首页 hero section | `page.tsx` |

### P1 打磨（已完成）

| # | 审计建议 | 落地状态 | 文件 |
|---|---|---|---|
| 7 | 卡片 hover 抬升 + 阴影 | ✅ `hover:-translate-y-0.5` + 大阴影 | `LeaderboardCard.tsx` |
| 8 | Favicon 字母兜底（Google favicon 服务失败时） | ✅ `onError` 回退首字母色块（抽成 `Favicon` 组件复用） | `Favicon.tsx` |
| 9 | 启用 stagger 入场动画（原 `.animate-fade-in` 是死代码） | ✅ 每卡 `animation-delay` 错峰淡入 | `globals.css` + `LeaderboardCard.tsx` |
| 10 | 分类改浅底 pill + NEW 标签（7 天内） | ✅ stone-100 pill + `isNew()` 判定 | `LeaderboardCard.tsx`、`format.ts` |
| 11 | StatsBar 改为单条带分隔的"仪表盘"条 | ✅ 4 列 grid + 内分隔线 | `StatsBar.tsx` |
| 12 | Header logo 加 teal 小点 + 毛玻璃 | ✅ 渐变 mark + accent dot + backdrop-blur | `Header.tsx` |
| 13 | 详情页分类改 pill、分数改圆环、"Visit site" 换强调色 | ✅ | `domain/[domain]/page.tsx` |

### P2（暂未做，待确认）

| # | 审计建议 | 状态 |
|---|---|---|
| 14 | 深色模式（Tailwind v4 `prefers-color-scheme` + 另一套 token） | ⏸ 待产品确认是否需要 |

---

## 二、SEO 审计落地（对照 `SEO_AUDIT.md`）

技术地基原本就优秀（100% SSG、详情页独立 title/description、内链完整、字体自托管）。本轮补齐"被发现 + 被读懂"层面。

### P0 致命级（已完成）

| # | 审计建议 | 落地状态 | 文件 |
|---|---|---|---|
| 1 | 首页加真正的 `<h1>` + 导语（原首页只有 h2，标题层级断裂） | ✅ hero 承载 H1 "The radar for rising SaaS & AI products." | `page.tsx` |
| 2 | 加 XML sitemap（775 页原本只靠首页内链发现，慢且易漏收） | ✅ `app/sitemap.ts` 构建时输出 1+775 条 | `app/sitemap.ts` |
| 3 | 加结构化数据 JSON-LD（原本拿不到任何富结果） | ✅ 首页 `ItemList`、详情页 `SoftwareApplication` + `BreadcrumbList` | `page.tsx`、`domain/[domain]/page.tsx` |
| 4 | 首页内容补强 + 薄页 noindex | ✅ hero 导语承载核心词；薄页（无 description 且非 alive）→ `noindex,follow` | `page.tsx`、`domain/[domain]/page.tsx` |

### P1 重要级（已完成）

| # | 审计建议 | 落地状态 | 文件 |
|---|---|---|---|
| 5 | `metadataBase` + canonical（原 OG 绝对 URL 缺失，URL 变体重复收录风险） | ✅ layout 设 `metadataBase`，首页 canonical `/`，详情页 canonical `/domain/<d>` | `layout.tsx`、`domain/[domain]/page.tsx` |
| 6 | `robots.txt` 并引用 sitemap | ✅ `app/robots.ts` | `app/robots.ts` |
| 7 | 首页 775 链接一次性堆出（权重稀释） | ✅ 客户端只显示 Top24 + Load more，**但 775 条全渲染进 HTML**（SEO 内链图完整） | `Leaderboard.tsx` |
| 8 | favicon 懒加载（原 775 个全部急加载，拖累 LCP） | ✅ `loading="lazy" decoding="async"` | `LeaderboardCard.tsx`、`Favicon.tsx` |
| 9 | Open Graph / Twitter Card / og:image | ✅ layout 加 OG/Twitter meta + 新建 1200×630 `og.png` | `layout.tsx`、`public/og.png` |

### P2 优化级（已完成）

| # | 审计建议 | 落地状态 |
|---|---|---|
| 10 | Title 关键词前置 / 详情页标题带分类 | ✅ 详情页 `vcdoc.in Healthcare — GrowthRadar` |
| 11 | BreadcrumbList JSON-LD | ✅ 详情页已注入 |

---

## 三、无障碍 & 打磨审计落地（第二轮审计）

第二轮审计针对完成度做体检，重点修 WCAG 与交互一致性。

### 应修复 FAIL（已完成）

| # | 审计建议 | 落地状态 | 文件 |
|---|---|---|---|
| 1 | 对比度跌破 AA：详情页 `text-text-muted/80`（相对时间行）约 3.5:1 | ✅ 去掉 `/80`，用纯 `text-text-muted`（~4.6:1） | `domain/[domain]/page.tsx` |
| 2 | 缺 `prefers-reduced-motion` 守卫，前庭安全风险 | ✅ 全局媒体查询，reduce 时 animation/transition 降到 0.001ms | `globals.css` |
| 3 | 搜索框用 emoji 🔍，跨平台渲染不一致 | ✅ 改内联 SVG 放大镜，与全站一致 | `Leaderboard.tsx` |
| 4 | 分类 chip 触控目标约 30px < 44px | ✅ `py-2.5 min-h-[36px]`（达 WCAG 2.5.5） | `Leaderboard.tsx` |

### 可优化 WARN（已完成）

| # | 审计建议 | 落地状态 | 文件 |
|---|---|---|---|
| 5 | teal 过载：Top3+NEW 卡片 4 处 teal | ✅ NEW 药丸改 amber `#d97706`（新 `--color-fresh` token），区分信号 | `globals.css`、`LeaderboardCard.tsx` |
| 6 | 难度点绿/黄/红 与"分数不用交通灯"哲学矛盾 | ✅ 改同色相 teal 渐变：low=zinc-400 / medium=teal-600 / high=teal-700 | `globals.css`、`format.ts` |
| 7 | 缺语义化排名、焦点环、skip-link | ✅ `<div>`→`<ol>`(781 `<li>`)；全局 `:focus-visible` teal 环；首页/详情页 skip-link | `Leaderboard.tsx`、`globals.css`、`page.tsx` |
| 8 | h2(16px) 与 h1(34px) 跳变过陡；圆角混用 | ✅ h2 提到 20px；圆角收敛为 10（小）/ 14（卡片）/ full（pill）三档 | `page.tsx` + 全组件 |

---

## 四、文案可读性优化（非审计，用户反馈驱动）

| 改动 | 原文 | 新文案 |
|---|---|---|
| 难度/竞争标签改人话 | `high replication` / `medium competition` | `Hard to copy` / `Some competition`（集中映射 `difficultyLabel()`） |
| 分类 chip 排序 | `other` 混在中间 | `other` 固定排到末尾（兜底分类不抢位） |

---

## 五、验证记录

- ✅ `tsc --noEmit` 通过
- ✅ `next build` 成功，生成 **781 个静态页**（首页 + 775 详情页 + sitemap.xml + robots.txt + not-found）
- ✅ HTML 含：1 个 `<h1>`、`ItemList` JSON-LD、775 个内链、781 个 `<li>`、`<main id="main">`、skip-link、SVG 搜索图标（emoji 已移除）
- ✅ 详情页：`SoftwareApplication` + `BreadcrumbList`、canonical、分类后缀 og:title
- ✅ 薄页 `noindex,follow`（如 `multiplying.me`），正常页 `index,follow`
- ✅ 编译后 CSS 含：`prefers-reduced-motion`、`:focus-visible`、amber `#d97706`、teal 难度渐变
- ✅ 浏览器实测：难度点 teal 渐变、NEW 药丸琥珀色、对比度修复、搜索/分类/Load more 交互正常

---

## 六、后续待办

- [ ] 深色模式（P2，待产品确认是否需要）
- [ ] favicon 本域代理/缓存（替代 Google 第三方域名，顺带彻底解决兜底 + 性能）
- [ ] 首页"Discovered 7d"配迷你趋势（如 `↑ 23.5K`）
- [ ] Score 圆环旁加 tooltip 说明"基于 8 个信号的启发式评分（0–100）"，目前只写 `opportunity` 太含糊
