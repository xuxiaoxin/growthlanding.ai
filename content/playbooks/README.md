# Playbook 内容生产流程

> 这是一份**自包含的操作手册**，给人（作者/编辑）和 AI writing agent 用。
> 讲清楚一篇 `/playbooks` 文章从选题到发布的完整流程。
> 本文是独立文档，不依赖其他地方引用。

---

## 0. 一篇 playbook 是什么

一篇 playbook = **"方法论 + 实操"指南**，瞄准"还没决定做什么"的潜在 solo founder。

它回答这类问题：
- 一人公司创始人如何发现别人在做什么
- 如何研究一个赛道的竞品密度
- 如何判断一个机会适不适合一个人做
- 如何验证一个想法

**不是**：产品新闻、行业动态、随笔、或者"我们发现了多少新站"的流水账。

playbook 这个词的潜台词：**经过验证、照着做就能复制的打法**。读者预设是"要下场动手的人"，不是旁观者。

---

## 1. 选题

### 1.1 该写什么

一个好的 playbook 选题要同时满足：

| 维度 | 判断标准 |
|---|---|
| **搜索意图契合** | 搜这个词的人，是不是"还没决定做什么"的潜在 solo founder？ |
| **数据契合** | 这篇能不能用你库里的真实站点当案例/证据？还是得全靠空泛方法论？ |

两个都满足 = 金矿。只满足第一个（搜索量大但你的数据不是答案）= 陷阱，会写成水货。

**好选题示例**（数据契合度高）：
- "How solo founders discover what to build next" —— 你的整个管道就是干这个的
- "How to research competitors in a niche" —— 用同分类 related 数据当证据
- "How to tell if an opportunity is solo-founder-friendly" —— 用 replication_difficulty 当信号

**差选题示例**（搜索量大但数据不契合，别碰）：
- "How to start a company" —— 话题太大，你的数据只覆盖"发现机会"这一环
- "How to register an LLC" —— 法务/税务，你帮不上
- "Best AI tools 2026" —— 这是目录页的活，不是 playbook 的活

### 1.2 选题评估三问

动手写之前，先回答：
1. 搜这个词的人，下一步会做什么动作？这个动作 GrowthRadar 能不能帮上？
2. 我能从 `featured-details.json` 里挑出 1-3 个真实站当案例吗？
3. 我能不能给出"别人给不出的独家证据"（因为只有我在追踪早期站）？

三个都是 yes，才写。

---

## 2. 内容原则

### 2.1 结构：方法论 + 独家证据 + 实操演示

纯方法论文章网上到处都是。你能赢的唯一理由是：**别人的方法论是空的，你的方法论有独家数据当证据**。

每篇 playbook 的结构应该是：

```
1. 方法论骨架（干货，Google 认可的信息增益）
   "发现别人在做什么的 3 条途径：A / B / C"

2. 每个方法配独家证据（别人抄不动的部分）
   方法 A: 监控新域名注册 →
     "我们追踪到 7 月新上线的站里，AI Tools 赛道最拥挤。
      比如 <DomainCard domain="xxx" /> 就是一个典型案例。"

3. 手把手演示用 GrowthRadar 落地
   "想要更系统？GrowthRadar 帮你做了前两步：
    去首页 → 按 category 筛 → 看 replication_difficulty 徽章 →
    找 Low difficulty 的机会 → 点进详情页看 Solo Founder Angle"
```

**关键**：步骤 2 是护城河。别人写"monitor new domain registrations"是空话；你写"我们追踪到 7 月有 89 个 AI Tools 新站"，这是只有你有的事实。

### 2.2 品牌语言

**推荐用词**（强化定位）：
`radar` / `signal` / `validated` / `solo-friendly` / `market-proven` / `opportunity` / `worth studying` / `low-friction`

**禁用词**（降低质感 / 有抄袭暗示）：
`clone` / `copy` / `scrape` / `hack` / `get rich quick`

内部评分概念 `copyability` 可以在代码里用，但**对外文案不出现**。对外强调"降低试错成本"和"市场验证"。

### 2.3 内链

每篇 playbook 必须：
- 用 `<DomainCard domain="xxx" />` 嵌 1-3 个真实站当案例（这是内链 + 案例双重作用）
- 至少链回 1 个 `/category/xxx` 页（让读者按赛道深挖）
- 必要时链回其他 `/playbooks/xxx`（形成 playbook 之间的网）

不要让 playbook 成为内链终点。

---

## 3. 起草 → 人审 → 发布

### 3.1 AI 起草

- **输入**：白名单字段（见 §5）+ `webui/public/data/featured-details.json`
- **输出**：MDX 初稿（格式见 §4）
- **关键**：初稿**默认存为草稿，不合入主干**。必须经过人审才能发布。
- AI 起草时就要遵守 §5 脱敏红线和 §2 品牌语言，不要等人审时再改。

### 3.2 人审 checklist

发布前逐项确认：

- [ ] **选题匹配**：符合 §1.2 三问，不是水货选题
- [ ] **结构对**：有方法论骨架 + 独家证据 + 实操演示三段
- [ ] **案例站合适**：`<DomainCard>` 引用的域名是 featured + alive + 有 summary（下线站会让卡片消失，文章留空洞）
- [ ] **品牌语言**：无 clone/copy/scrape/hack；用了推荐词
- [ ] **脱敏**：通读全文 + 检查 DomainCard 引用，确认无红线字段泄露（见 §5）
- [ ] **内链**：有 DomainCard + 至少一个 /category 链接
- [ ] **无 AI/LLM 字眼**：全文不提"AI 生成"/"LLM 分析"等（产品红线）
- [ ] **metadata 完整**：title/description/slug/category/order 都填了

### 3.3 发布

发布 = 3 步：

1. **存文件**：把审核通过的 `.mdx` 放进 `webui/content/playbooks/`（文件名 = slug，如 `validate-saas-idea.mdx`）

2. **注册文章**（唯一需要改代码的地方）：在 `webui/src/lib/playbooks.ts` 的 `getPlaybook()` 映射表加一行：
   ```ts
   "validate-saas-idea": () => import("../../content/playbooks/validate-saas-idea.mdx"),
   ```
   注释里写了："Adding an article = add one import line. This is intentional (explicit over implicit)."

3. **部署**：`git push`（dual-push 到私有 + 公开仓，Vercel 自动 rebuild）

发布后 playbook 自动出现在：`/playbooks`（索引页）+ `/playbooks/{slug}`（详情页）+ sitemap。

---

## 4. MDX 文件格式（可复制模板）

```mdx
export const metadata = {
  title: "How Solo Founders Discover What to Build Next",
  description: "A starter playbook for spotting market-validated opportunities before you write a line of code, with a real early-stage site as a worked example.",
  slug: "find-what-to-build",
  category: "discovery",
  order: 1,
}

import { DomainCard } from '@/components/DomainCard'

# How Solo Founders Discover What to Build Next

正文段落...

## 方法一：监控新域名注册

我们追踪到 7 月新上线的站里，AI Tools 赛道最拥挤。
比如 <DomainCard domain="translate.mom" /> 就是一个典型案例。

## 用 GrowthRadar 落地

想要更系统？去首页按 category 筛选...
```

### metadata 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 文章标题（H1 也会用这个，或单独写 H1） |
| `description` | ✅ | meta description，≤155 字符，会进 SEO + 索引页摘要 |
| `slug` | ✅ | URL 段，`/playbooks/{slug}`，必须和文件名一致（去掉 .mdx） |
| `category` | ✅ | 固定枚举之一（见下），用于索引页分组 |
| `order` | ✅ | 数字，同 category 内排序 |

### category 固定枚举（不要自造）

```ts
type PlaybookCategory = "discovery" | "validation" | "build" | "growth";
```

| 值 | 含义 | 示例选题 |
|---|---|---|
| `discovery` | 发现机会 | 如何发现别人在做什么、如何找赛道 |
| `validation` | 验证想法 | 如何判断机会值不值得做、如何看竞品密度 |
| `build` | 构建执行 | 如何判断适不适合 solo、如何挑 MVP 范围 |
| `growth` | 增长运营 | 如何看早期商业化信号、如何定价 |

### 几个硬规则

- **用 `export const metadata`，不要用 YAML frontmatter**。`@next/mdx` 默认不支持 frontmatter，加了会报错。
- **`DomainCard` 是 async Server Component**，在 MDX 里直接用 `<DomainCard domain="xxx" />` 即可，不需要 await。
- **`DomainCard` 引用的域名必须真实存在**（featured + alive）。下线站会让卡片渲染成 null，文章留空洞。
- **命名导出名是 `metadata`**，不要和 Next.js 的 `generateMetadata` 函数混淆 —— 两者无关。

---

## 5. 脱敏红线（写文章必读）

这是最重要的 section。违反红线 = 泄露内部检测方法 = 损害数据资产。

### 5.1 可以用的字段（白名单）

这些是从 `featured-details.json` 里可以安全引用的：

| 字段 | 用途 |
|---|---|
| `domain` | 域名，链到详情页 |
| `category` / `subcategory` | 分类 |
| `summary` | 一句话描述（DomainCard 默认渲染） |
| `description` | 详细描述 |
| `key_features` | 核心功能 |
| `target_users` | 目标用户 |
| `why_interesting` | 为什么值得研究 |
| `replication_difficulty` | 复制难度（low/medium/high）—— DomainCard 默认渲染 |
| `competition_level` | 竞争激烈度 |
| `survival_status` | 存活状态（抽象的 alive/dead，不是窗口标签） |
| `business_model` | 商业模式 |
| `first_seen` | 首次发现时间 |

### 5.2 绝不能出现的字段（红线）

这些字段**绝不**出现在任何 playbook 文章里（正文、DomainCard、截图、举例都不行）：

```
score / opportunity_score / opc_rank_score / copyability / leverage
dns_richness / page_count / has_payment_sdk / payment_provider
score_breakdown / internal_links / sitemap_url
alive_30d / alive_90d / alive_180d（survival 窗口明细标签）
llm_confidence / llm_model
CrUX 原始字段（LCP/FCP/CLS 等原始数值）
```

### 5.3 survival 数据的当前规则（重要）

`alive_30d` / `alive_90d` 这些**纵向 survival 窗口标签**目前是红线。

- **单站明细**：绝不写"站点 X 的 alive_30d = true"这种。
- **聚合统计**：能不能写"我们追踪的站里，AI Tools 赛道 30 天存活率约 60%"这种聚合数字？—— **目前边界未定，暂不写**。等脱敏边界拍板后，本文档会更新这一节。

在那之前，playbook 里只用 `survival_status`（抽象的 alive/dead）和 `first_seen`，不用任何窗口标签。

### 5.4 DomainCard 已经帮你兜底

好消息：`DomainCard` 组件**只读白名单字段**（domain / summary / replication_difficulty / category），它在代码层面就拦住了红线字段。所以只要你在文章里只用 `<DomainCard>`，不会意外泄露。

风险只在**你手写的正文**里 —— 比如你写"这个站的 dns_richness 很高"，这就违规了。所以正文里描述站点时，只用 §5.1 的白名单词汇。

---

## 6. 发布后的社区分发（可选）

playbook 发布后，可以主动分发到社区获取外链和早期流量。这是**运营动作，不是工程任务**，按需做。

### 6.1 渠道

- Hacker News —— "Show HN"
- Reddit —— `r/SaaS`、`r/indiehackers`
- Indie Hackers
- X / Twitter

### 6.2 发帖规则

- 每次发：精选 1-3 个新发现站点 **或** 一篇已发布的 playbook + 一句 why-it's-interesting
- 用公开字段（`summary` / `why_interesting`），**不提 AI/LLM**
- 附 GrowthRadar 链接
- 优先发"刚上线、还冷门"的站点 —— 抢"最早发现"的叙事，契合站点差异化

### 6.3 触达被收录的创始人

被 GrowthRadar 收录的站点创始人，可以通知他们（"we featured you"）。**因 email red-line，走社交 DM / X @，不发邮件。**

### 6.4 追踪

用 Google Search Console 记录 backlink 增长和引荐流量，便于后续对比哪些渠道有效。

---

## 7. 维护

这份文档会随以下变化迭代：
- **脱敏边界拍板**后，§5.3 的 survival 数据规则会更新
- **社区分发经验积累**后，§6 会补充哪些渠道/话术有效
- **playbook 数量增加**后，§1 的选题策略可能会按已覆盖主题调整

迭代时直接改本文档，不需要走 business-analysis 的 spec/ADR 流程（本文档是独立的操作手册，不进注册体系）。
