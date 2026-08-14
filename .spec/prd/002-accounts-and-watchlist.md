# 账号系统（Auth.js v5）+ Watchlist（P0 实施轮）

> 审计依据：本次代码级调研（逐行核对 `src/db/schema.ts`、`src/components/Header.tsx`、
> `src/app/api/subscribe/route.ts`、`webui/CLAUDE.md`、`node_modules/next/dist/docs`、
> Auth.js 官方安装文档与 GitHub issue #13302）。
> 技术栈：Next.js 16.2.4（middleware 已改名 **proxy**）+ React 19.2.4 + drizzle-orm + Neon。
> 数据规模：约 1090 个 SSG 静态页（构建产物 HTML 实测约 1286 个，见调研）。
> 登录方式：GitHub + Google 双 OAuth（纯 provider，无需 `verificationTokens` 表）。

---

## 开发流程状态

| 阶段               | 状态 | 完成时间   | 备注                                                                              |
| ------------------ | ---- | ---------- | --------------------------------------------------------------------------------- |
| 1. 创建计划        | ✅   | 2026-08-13 | 调研 + 架构设计已锁定（见下方）                                                   |
| 2. 完成 PRD        | ✅   | 2026-08-13 | 本文档（待人工 review）                                                           |
| 3. 编写代码        | ⏳   | -          | 待 PRD 审核通过后实施                                                             |
| 4. 自测 + 代码检查 | ⏳   | -          | 含 SSG 回归检查（静态页数量不变 + `middleware-manifest.json` 为空 + SEO 页仍 `Ø`）|
| 5. 部署 + 标记完成 | ⏳   | -          | 待部署到 Vercel（需先配 OAuth secrets）                                           |

---

## 需求描述

**背景**：商业模式产品化的前置阻塞是账号系统。经代码级核对（以源码为准）：

- **账号系统现状（RESERVED / 0 实现）**：`src/db/schema.ts` L6、L52-55、L58-90 已按 `@auth/drizzle-adapter` 形状预留 `users` / `accounts` / `sessions` 三张表，但运行时**零实现**——`package.json` 无 `next-auth` 等任何 auth 依赖（连间接依赖都没有）；全项目无 `auth.ts` / `middleware.ts` / 登录页 / `signIn` 调用；三张预留表从未被任何代码 import 或查询。红线写在两处：`schema.ts:10-14` 与 `webui/CLAUDE.md:167-168`（"Auth.js login is NOT wired yet — do not add middleware, it would break SSG"）。
- **watchlist 现状（连占位都没有）**：全仓库 `watchlist` 仅命中 `schema.ts:13` 一处注释（划归未来 "Track/watchlist phase"）。无 API、无页面、无按钮、无表、无 localStorage。
- **支付侧动机**：Creem（Merchant of Record）支付已在申请中，但因缺少 pricing UI 等上线内容暂未过审（账号系统是付费 watchlist / 后续商业化的前置依赖）。

**目标**：本轮（P0）接入 **GitHub + Google 双 OAuth 账号系统**（Auth.js v5）+ **watchlist 收藏功能**，且**完全不破坏现有 SSG 静态页的 SEO**。定价 / Creem checkout / watchlist 邮件提醒等作为 P1 单独立项，**本轮不展开**。

**价值**：
- 打通账号闭环，为后续付费功能（付费 watchlist、API、早发现）铺路；
- watchlist 是 GrowthRadar 最自然的"主动追踪"价值点，为付费意愿验证提供载体；
- 证明"动态账号岛 + 100% SSG"可共存，确立后续所有账号相关功能的架构范式。

---

## 用户故事

**角色**：独立创始人 / 寻找可复刻机会的研究者 / 站点运营者

- **故事 1**：作为研究者，我希望用 GitHub 或 Google 一键登录，以便收藏感兴趣的站点并在之后回看，而不必记住新密码。
- **故事 2**：作为研究者，我希望在排行榜卡片和详情页上一键收藏站点，以便把它们加入我的 watchlist 持续追踪。
- **故事 3**：作为已登录用户，我希望有一个 `/app/watchlist` 页面集中查看我收藏的所有站点，以便统一管理和回访。
- **故事 4**：作为站点运营者，我希望账号系统**不破坏 SEO**——静态排行榜 / 详情页仍以纯静态 HTML 落盘，抓取预算与收录不受影响。
- **故事 5（SEO 爬虫视角）**：作为爬虫，我希望 `/`、`/category/*`、`/opportunity/*`、`/playbooks/*` 仍是构建期静态产物，不被任何 auth / proxy 逻辑降级为 per-request 渲染。
- **故事 6（安全视角）**：作为站点运营者，我希望 OAuth secrets 与 `AUTH_SECRET` 绝不进入公开仓库（webui dual-push 到 `xuxiaoxin/growthlanding.ai` 公开 repo），session 以加密 JWT cookie 存储、不存密码。

---

## 功能需求

### 1. P0（本轮实施 —— 必须可落地）

- [ ] **P0-1 Auth.js v5 接入（GitHub + Google，JWT 策略，drizzle adapter）**

  - 安装 `next-auth@beta`（v5；支持 Next 16。**勿装 v4**——v4 的 peer dep 不含 Next 16，会冲突，见 GitHub issue #13302）+ `@auth/drizzle-adapter`。
  - 新建 `src/auth.ts`：`NextAuth({ adapter: DrizzleAdapter(db), session:{strategy:"jwt"}, providers:[GitHub, Google], callbacks:{...} })`，导出 `handlers / signIn / signOut / auth`。
  - 新建 `src/app/api/auth/[...nextauth]/route.ts`：`export const { GET, POST } = handlers;`
  - 运行 `npx auth secret` 生成 `AUTH_SECRET` 写入 `.env.local`。
  - **不创建 `proxy.ts` / `middleware.ts`**（见非功能需求 SSG 红线）。
  - 验收：GitHub / Google OAuth 登录闭环可用；登录后 `users` / `accounts` 表有记录；`sessions` 表**无**写入（JWT 策略）；未登录访问受保护路由被重定向到 `/app/login`。

- [ ] **P0-2 `/api/me` 登录态探测端点**

  - 新建 `src/app/api/me/route.ts`：`GET` 调 `auth()`，返回 `{ authed: boolean, name?, image? }`（**不含 email 等敏感字段**）。对齐 `subscribe/route.ts` 的 `{ok,...}` 风格 + try/catch + 不泄露内部。
  - 用途：Header 的 `<AccountMenu/>` client island 判断登录态（client 读不到 httpOnly 的 session cookie，必须经此端点）。
  - 验收：未登录返回 `{authed:false}`；已登录返回 `{authed:true, name, image}`；响应不含 email。

- [ ] **P0-3 `/app/*` 动态账号岛：login / dashboard**

  - 新建 `src/app/app/login/page.tsx`：两个按钮 "Continue with GitHub" / "Continue with Google"，分别触发 server action `signIn("github"|"google", {redirectTo:"/app/dashboard"})`；已登录则 `redirect("/app/dashboard")`。`metadata.robots = {index:false, follow:false}`。
  - 新建 `src/app/app/dashboard/page.tsx`：RSC 顶部 `const session = await auth()`，无 session → `redirect("/app/login")`；显示用户头像 / 名字 / 邮箱 / 登录 provider + 入口卡片（Watchlist → `/app/watchlist`；Billing / Settings 占位）。套 `about/page.tsx` 骨架（Header + main.max-w-3xl + PageFooter），但 noindex。
  - 验收：未登录访问 `/app/dashboard` 重定向到 `/app/login`；两个页面均 `noindex`。

- [ ] **P0-4 Header 账号入口（client island，不破坏 SSG）**

  - `src/components/Header.tsx` **保持 Server Component、纯静态**（Header 出现在每个静态页上，**绝不能在 Header 里调 `auth()`**，否则 ~1090 静态页全变动态）。
  - 新建 `"use client"` 组件 `src/components/AccountMenu.tsx`：mount 后 `fetch("/api/me")`，未登录显示 "Sign in" → `/app/login`；已登录显示头像 + 下拉（Dashboard / Watchlist / Sign out）。状态机参考 `NewsletterSubscribe.tsx`（idle/loading/error/success）。
  - 在 Header 右侧 tagline 位置（`Header.tsx:37-39`）渲染 `<AccountMenu/>`。
  - 验收：Header 仍是静态产物的一部分；账号入口在 hydrate 后才 fetch，宿主页 SSG 判定不变（见验收 SSG 回归）。

- [ ] **P0-5 watchlist 表 + drizzle-kit push**

  - `src/db/schema.ts` 新增 `watchlist` 表（见技术实现签名）。
  - 更新 schema 文件头注释：把"RESERVED / not wired"改为"Auth.js wired (JWT strategy); watchlist active"。
  - 推送：`npx drizzle-kit push`（用 `DATABASE_URL_UNPOOLED`，符合 `drizzle.config.ts` 惯例，无迁移文件）。
  - 验收：Neon 中存在 `watchlist` 表，含 `(userId, domain)` 唯一索引；`users` / `accounts` 表结构不变。

- [ ] **P0-6 收藏交互（server action + `<WatchlistButton/>`）**

  - 新建 `src/app/actions/watchlist.ts`（`"use server"`）：
    - `toggleWatchlist(domain)`：`const session = await auth()`；无 session → `redirect("/app/login")`；有 session → upsert / delete `watchlist` 表（`(userId, domain)` 唯一索引保证幂等）。注意 `userId` 类型转换：`session.user.id` 为 string、DB `userId` 为 integer，用 `Number(session.user.id)`。
    - `isWatchlisted(domain)`：返回当前用户是否已收藏（供按钮初始态）。
  - 新建 `"use client"` 组件 `src/components/WatchlistButton.tsx`：显示已收藏 / 未收藏态，点击调 `toggleWatchlist`。样式沿用现有描边按钮 / chip 风格（参考 `Leaderboard.tsx` 的次级按钮）。
  - 放置：`LeaderboardCard.tsx`（已 client）卡片 + `opportunity/[domain]` 详情页。这些是静态页内的 client 岛，按钮自身不破坏 SSG（hydrate 后才调 action）。
  - 验收：未登录点收藏 → 重定向登录页；已登录点收藏 → 表写入、按钮态切换；重复点击幂等（无重复行）。

- [ ] **P0-7 `/app/watchlist` 页面**

  - 新建 `src/app/app/watchlist/page.tsx`：RSC `auth()` 守卫 → 查 `watchlist` 表得 domains → 复用 `src/lib/data-server.ts` 取站点信息渲染卡片（复用 `LeaderboardCard` 风格）。noindex。
  - 空态：无收藏时显示引导卡片（"去排行榜发现值得追踪的站点" + 链接 `/`）。
  - **实施时验证**：serverless 运行时 `fs` 读 `public/data/*.json` 是否可用；若 Vercel function 读不到，回退为 fetch 公开 URL（`/data/featured.json` 等）。
  - 验收：已登录看到自己收藏的站点卡片列表；未登录重定向；空态友好。

- [ ] **P0-8 `/privacy` 页同步更新（必须，否则违反项目"隐私文案=代码"红线）**

  - 当前 `src/app/privacy/page.tsx:9,84,103` 明文写 "no user accounts (Auth.js tables are reserved but not wired)"。接入后改为披露：
    - 账号系统：GitHub / Google OAuth，session 存 `AUTH_SECRET` 加密的 JWT cookie（httpOnly）。
    - 账号数据存于 Neon：`users`（name / email / image）、`accounts`（OAuth token）、`watchlist`（收藏的 domain）。
    - 不存密码（OAuth only）。
  - 验收：`/privacy` 文案与实际数据流一致；含 OAuth provider 与 session cookie 披露。

- [ ] **P0-9 `.env.example` 文档化**

  - 项目目前无 `.env.example`。新建（**无真实值**）文档化所有所需 key：`DATABASE_URL` / `DATABASE_URL_UNPOOLED` / `RESEND_API_KEY` / `AUTH_SECRET` / `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` / `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`。
  - 验收：`.env.example` 进仓（无密钥），`.env.local` 仍被 `.gitignore` 忽略。

### 2. P1（spec 但延后 —— 下一轮）

> 本轮**不实现**，仅记录范围：

- [ ] **Pricing 页 + waitlist 收集**：带付费计划的 `/pricing` 静态页 + waitlist 表，用于解锁 Creem 审核 + 验证 willingness-to-pay（详见调研建议的 Free / Pro / Business 切分）。
- [ ] **Creem checkout 接入**：SDK + env + 订阅表 + checkout / webhook 路由 + paywall（依赖 P0 账号系统）。
- [ ] **watchlist 邮件 / Slack 提醒**：收藏站点出现新动态时主动推送（Pro 功能）。
- [ ] **付费 watchlist gating**：watchlist 数量限制 / 仅 Pro 可用（依赖 Creem 接入）。

### 3. P2（spec，延后）

- [ ] **API 访问**：付费用户的 `growthlanding.ai/api/v1/*` 数据接口。
- [ ] **CSV 导出**：watchlist / 排行榜导出。
- [ ] **团队共享 watchlist**：多用户协作。
- [ ] **早发现（t+0）**：付费用户比公开榜更早看到新站（需确认 pipeline 支撑）。

### 4. 边界情况

| 场景                                   | 预期行为                                    | 处理方式                                                                  |
| -------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| 未登录点收藏                           | 重定向到 `/app/login`                       | server action `auth()` 无 session → `redirect("/app/login")`              |
| `users.id`(integer) vs JWT id(string)  | 正确转换，不报错                            | server action / 查询用 `Number(session.user.id)`；实施时验证 adapter 兼容 |
| 重复收藏同一 domain                    | 幂等，不产生重复行                          | `(userId, domain)` 唯一索引 + upsert                                      |
| OAuth 回调 URL 不匹配                  | 登录失败，提示回调地址                      | GitHub / Google OAuth App 配置正确 callback URI（见下方配置）             |
| 删除用户                               | 级联删除其 watchlist                        | `references(() => users.id, { onDelete: "cascade" })`                     |
| serverless 读不到 `public/data`        | watchlist 页仍可用                          | 回退 fetch 公开 URL（`/data/featured.json`）                              |
| OAuth provider token 过期              | 用户需重新登录                              | JWT 策略下下次登录刷新；本轮不做静默刷新                                  |
| 第三方 cookie 限制（Safari 等）        | OAuth 仍可用（Auth.js 用 first-party cookie）| 验证主要浏览器登录正常                                                    |

### 5. 性能要求

| 指标                          | 要求                                              | 验证方法                                              |
| ----------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| 静态页数量                    | 与接入前一致（构建产物 HTML 约 1286 个）          | `find .next/server/app -name "*.html" \| wc -l`       |
| `middleware-manifest.json`    | 仍为空（`"middleware": {}`）                      | 读 `.next/server/middleware-manifest.json`            |
| SEO 页渲染模式                | `/`、`/opportunity/*`、`/category/*` 仍标记 `Ø`   | `next build` 输出核对                                  |
| 客户端 JS 增量                | 仅 `<AccountMenu/>` + `<WatchlistButton/>` 小岛   | 构建产物 client chunk 抽样核对                        |
| `/api/me` 响应                | < 100ms（仅读 JWT cookie，不查库）                | 本地 / 部署后抽测                                     |
| Header 静态产物               | 不因 `<AccountMenu/>` 变成动态                    | SSG 回归检查                                          |

---

## 非功能需求

### 安全 / SSG 红线（CRITICAL）

- [ ] **不得在静态 SEO 页的 RSC 树调用 `auth()` 或 import auth 模块**：`/`、`/category/*`、`/opportunity/*`、`/playbooks/*`、`/about`、`/privacy`、`/terms` 的 Server Component 树**零** auth 依赖，否则会被降级为 per-request 渲染，破坏 SEO（`schema.ts:10-14`、`CLAUDE.md:167-168`）。
- [ ] **不创建 `proxy.ts` / `middleware.ts`**：Auth.js 官方文档明确 proxy 是**可选**的（"Add optional Proxy to keep the session alive"）。不用它彻底规避：(a) matcher 配错把 SEO 页打成动态；(b) Next 16 proxy 改名的兼容不确定性。所有鉴权放 RSC `auth()` + 重定向。
- [ ] **Header 保持纯静态**：`src/components/Header.tsx` 是 Server Component 且出现在每个静态页，**绝不在 Header 里调 `auth()`**。账号入口走 `<AccountMenu/>` client island（mount 后 fetch `/api/me`，无数据 hydrate，不影响 SSG 判定）。
- [ ] **secrets 绝不进公开仓**：`AUTH_SECRET` / OAuth secrets 仅放 `.env.local`（本地）+ Vercel env（线上）。`.gitignore` 已忽略 `.env*.local`。webui dual-push 到公开 repo `xuxiaoxin/growthlanding.ai`，任何密钥/连接串不得 commit。
- [ ] **不存密码**：OAuth only，无 Credentials provider，无密码字段。
- [ ] **不暴露检测信号字段**：沿用 001 的脱敏红线——不得新增 `score_breakdown` / `dns_richness` / `has_payment_sdk` 等内部字段到前端或 JSON-LD。

### 可用性要求

- [ ] 支持主流浏览器（Chrome / Firefox / Safari / Edge）与移动端响应式。
- [ ] OAuth 第三方 cookie 限制（Safari ITP 等）下登录仍可用（Auth.js first-party cookie）。
- [ ] 收藏按钮有清晰 loading / 已收藏 / 未登录态反馈，对比度沿用 WCAG-AA。

### 兼容性要求

- [ ] 与现有 SSG 体系（sitemap、robots、canonical、`metadataBase`、JSON-LD）不冲突。
- [ ] 数据向后兼容：`users` / `accounts` / `sessions` 表结构不变，仅新增 `watchlist` 表。
- [ ] 依赖 `next-auth@beta`（v5），不引入 v4（peer dep 冲突）。

---

## 技术实现

> 鉴权架构：**不用 proxy，纯 RSC `auth()` 守卫**。`/app/*` 动态账号岛用 RSC 调 `auth()`，
> 静态 SEO 页 0 接触 auth。这是规避 SSG 红线的核心。

### 涉及文件

| 文件                                              | 操作 | 说明                                                                                  |
| ------------------------------------------------- | ---- | ------------------------------------------------------------------------------------- |
| `src/auth.ts`                                     | 新建 | NextAuth 配置（adapter / jwt / providers / callbacks）。                              |
| `src/app/api/auth/[...nextauth]/route.ts`         | 新建 | `export const { GET, POST } = handlers;`                                              |
| `src/app/api/me/route.ts`                         | 新建 | 登录态探测（`auth()` → `{authed, name?, image?}`）。                                  |
| `src/app/app/login/page.tsx`                      | 新建 | GitHub / Google 登录按钮（server action `signIn`）。noindex。                         |
| `src/app/app/dashboard/page.tsx`                  | 新建 | 用户信息 + 入口卡片。RSC `auth()` 守卫。noindex。                                     |
| `src/app/app/watchlist/page.tsx`                  | 新建 | 收藏列表。RSC `auth()` 守卫 + 复用 data-server。noindex。                             |
| `src/app/actions/watchlist.ts`                    | 新建 | `"use server"`：`toggleWatchlist` / `isWatchlisted`。                                 |
| `src/components/AccountMenu.tsx`                  | 新建 | `"use client"`：Header 账号入口（fetch `/api/me`）。                                  |
| `src/components/WatchlistButton.tsx`              | 新建 | `"use client"`：收藏按钮。                                                            |
| `src/components/Header.tsx`                       | 修改 | 右侧加 `<AccountMenu/>`（Header 保持纯静态 Server Component）。                       |
| `src/db/schema.ts`                                | 修改 | 新增 `watchlist` 表；更新头注释。                                                     |
| `src/app/privacy/page.tsx`                        | 修改 | 更新账号 / session cookie / watchlist 披露。                                          |
| `.env.example`                                    | 新建 | 文档化所有 env key（无真实值）。                                                      |

### `auth.ts` 签名（新建）

```ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),      // 写 users / accounts（OAuth 登录时）
  session: { strategy: "jwt" },     // 不写 sessions 表，session 存加密 cookie
  providers: [GitHub, Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;  // 把 user.id 带进 JWT
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
```

### `watchlist` 表签名（`src/db/schema.ts` 新增）

```ts
import { uniqueIndex } from "drizzle-orm/pg-core"; // 需补 import

export const watchlist = pgTable(
  "watchlist",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    domain: varchar("domain", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("watchlist_user_domain_idx").on(t.userId, t.domain)],
);
```

- 设计：watchlist 不复制站点数据，只存 `userId + domain`（domain 是引用 `public/data` 静态数据的 key）。展示时从静态 JSON 取详情。
- 唯一索引 `(userId, domain)` 防重复收藏 + 保证 upsert 幂等。
- `onDelete: cascade` 跟随用户删除。

### server action 守卫签名（`src/app/actions/watchlist.ts` 新建）

```ts
"use server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function toggleWatchlist(domain: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/app/login");  // 守卫
  const userId = Number(session.user.id);          // integer PK 类型转换
  // upsert / delete by (userId, domain) —— 用唯一索引幂等
  // ...
}

export async function isWatchlisted(domain: string) {
  const session = await auth();
  if (!session?.user?.id) return false;
  // select ... where userId = Number(session.user.id) and domain
}
```

### RSC 守卫模式（`/app/*` 页面统一）

```ts
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/app/login");
  // ... 渲染
}
```

- 这些页面天然动态（读 session cookie），符合预期；不影响静态 SEO 页。

### `/api/me` 签名（新建，对齐 `subscribe/route.ts` 风格）

```ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ authed: false });
  return NextResponse.json({
    authed: true,
    name: session.user.name,
    image: session.user.image,
  });  // 不含 email
}
```

### SSG / 脱敏约束确认

- 静态 SEO 页（`/`、`/category/*`、`/opportunity/*`、`/playbooks/*`、`/about`、`/privacy`、`/terms`）的 RSC 树**不 import `@/auth`、不调 `auth()`**。
- Header 保持 Server Component 纯静态，账号入口走 `<AccountMenu/>` client island。
- 不创建 `proxy.ts` / `middleware.ts`。
- 不新增任何脱敏字段到前端或 JSON-LD（沿用 001 红线）。

---

## 验收标准

### 功能验收

- [ ] **P0-1**：GitHub / Google 登录闭环可用；登录后 `users` / `accounts` 有记录，`sessions` 表无写入（JWT）。
- [ ] **P0-2**：`/api/me` 未登录返 `{authed:false}`，已登录返 `{authed:true,name,image}`（无 email）。
- [ ] **P0-3**：`/app/login` 两个 provider 按钮；`/app/dashboard` 未登录重定向；两页 `noindex`。
- [ ] **P0-4**：Header 账号入口在未登录 / 已登录态正确切换。
- [ ] **P0-5**：Neon 中 `watchlist` 表存在，含唯一索引。
- [ ] **P0-6**：未登录点收藏重定向；已登录收藏幂等；按钮态切换。
- [ ] **P0-7**：`/app/watchlist` 显示收藏列表，空态友好，未登录重定向。
- [ ] **P0-8**：`/privacy` 文案与实际数据流一致。
- [ ] **P0-9**：`.env.example` 存在且无密钥。

### SSG 回归验收（CRITICAL —— 不通过即方案失败）

- [ ] `next build` 成功。
- [ ] 构建产物 HTML 数量与接入前一致（约 1286 个）。
- [ ] `.next/server/middleware-manifest.json` 仍为空（`"middleware": {}`）。
- [ ] `/`、`/opportunity/[domain]`、`/category/[cat]`、`/playbooks/[slug]` 在构建输出仍标记为 `Ø`（static），**未**因 Header `<AccountMenu/>` 或任何 auth import 变成 `ƒ`（dynamic）。

### 安全 / 脱敏验收

- [ ] 仓库（公开 repo）grep 不到任何 OAuth secret / `AUTH_SECRET` / 连接串密码。
- [ ] `/api/me` 响应不含 email。
- [ ] 不存密码（无 Credentials provider）。
- [ ] 前端 / JSON-LD 未出现脱敏字段（沿用 001 grep 回归）。

### 兼容性验收

- [ ] sitemap、robots、canonical、`metadataBase` 未受影响。
- [ ] 桌面 / 移动端布局正常，主要浏览器 OAuth 登录正常。

---

## UI/UX 设计

### Header 账号入口（接入后）

```
┌──────────────────────────────────────────────────────────┐
│  ◼ GrowthRadar   Playbooks          [Sign in] / [avatar▾]│
│                                       Solo-founder...    │  ← AccountMenu（client island）
└──────────────────────────────────────────────────────────┘
```
- 未登录：右侧显示 "Sign in"（→ `/app/login`）。
- 已登录：显示头像 + 下拉（Dashboard / Watchlist / Sign out）。

### `/app/login`

```
┌──────────────────────────────────────────────┐
│                  Header                       │
├──────────────────────────────────────────────┤
│                                               │
│         Sign in to GrowthRadar                │
│         Save sites to your watchlist …        │
│                                               │
│    ┌──────────────────────────────────┐       │
│    │  [GH icon] Continue with GitHub   │       │
│    └──────────────────────────────────┘       │
│    ┌──────────────────────────────────┐       │
│    │  [G icon]  Continue with Google   │       │
│    └──────────────────────────────────┘       │
│                                               │
│    By continuing you agree to our Terms …     │
├──────────────────────────────────────────────┤
│                  PageFooter                   │
└──────────────────────────────────────────────┘
```

### `/app/dashboard`

```
┌──────────────────────────────────────────────┐
│  Home › Account                               │
│  ┌─────────────────────────────────────────┐ │
│  │ [avatar] {name}  · {email}              │ │  ← 用户信息
│  │          Signed in with GitHub          │ │
│  └─────────────────────────────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Watchlist│ │ Billing  │ │ Settings │      │  ← 入口卡片
│  │  12 sites│ │ (soon)   │ │ (soon)   │      │
│  └──────────┘ └──────────┘ └──────────┘      │
└──────────────────────────────────────────────┘
```

### `/app/watchlist`

```
┌──────────────────────────────────────────────┐
│  Home › Watchlist                             │
│  Your watched sites                           │
│  ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ fav  │ │ fav  │ │ fav  │   (Leaderboard   │
│  │domain│ │domain│ │domain│    Card 风格)     │
│  │[★]   │ │[★]   │ │[★]   │                  │
│  └──────┘ └──────┘ └──────┘                  │
│  -- 或（空态）--                              │
│  ┌─────────────────────────────────────────┐ │
│  │  No watched sites yet.                  │ │
│  │  Discover sites worth tracking → [Browse]│ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 交互流程

1. 访客在排行榜 / 详情页点收藏 → 未登录 → 重定向 `/app/login`。
2. 选择 GitHub / Google → OAuth 回调 → JWT cookie 写入 → 跳 `/app/dashboard`。
3. Header 账号入口 hydrate 后 fetch `/api/me` → 显示头像 + 下拉。
4. 点 watchlist 卡片 → `/app/watchlist` 查看收藏。
5. 登出 → 清 cookie → 回首页。

### 状态设计

- **Guest（未登录）**：收藏按钮触发重定向；Header 显示 Sign in。
- **Authenticated**：Header 显示头像下拉；收藏按钮直接落库；dashboard / watchlist 可访问。
- **Empty watchlist**：空态引导卡片。

---

## 测试计划

### 单元测试

- [ ] `toggleWatchlist`：未登录重定向；已登录幂等 upsert/delete。
- [ ] `isWatchlisted`：未登录返回 false；已登录按 (userId, domain) 查询。
- [ ] 类型转换：`Number(session.user.id)` 正确处理 integer PK。

### 集成测试

- [ ] GitHub OAuth 登录闭环（含回调）。
- [ ] Google OAuth 登录闭环。
- [ ] `/api/me` 两种态。
- [ ] `/app/*` 三页的守卫重定向。

### SSG 回归 / E2E

- [ ] `next build` 成功；静态页数量不变；`middleware-manifest.json` 为空；SEO 页仍 `Ø`。
- [ ] 抽样：首页点收藏（未登录）→ 登录 → 回详情页收藏 → 看 `/app/watchlist`。
- [ ] 桌面 / 移动视口下 Header 账号入口、login、dashboard、watchlist 不溢出。

### 脱敏 / 仓库安全回归

- [ ] 公开 repo grep 不到 `AUTH_SECRET` / OAuth client secret / DB 密码。
- [ ] `/api/me` 响应不含 email。
- [ ] 前端 / JSON-LD 无脱敏字段（沿用 001）。

---

## 风险评估

| 风险                                              | 影响 | 应对措施                                                                                   |
| ------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------ |
| Auth.js + integer PK (`users.id` serial) 兼容     | 中   | 预计可用（adapter 插入不传 id 让 DB 自增）；若 account linking 报错，备选改 text PK + uuid |
| serverless 读不到 `public/data`（watchlist 页）   | 中   | 实施时验证；回退 fetch 公开 URL（`/data/featured.json`）                                   |
| Next 16 + Auth.js v5 边缘情况                     | 中   | 方案刻意不依赖 proxy/middleware 规避；备选 better-auth（优先 Auth.js，官方已支持 Next 16） |
| OAuth 第三方 cookie 限制（Safari ITP）            | 低   | Auth.js first-party cookie；主要浏览器验证                                                 |
| 误把 auth 逻辑带进静态 SEO 页                     | 高   | SSG 回归验收（静态页数 + manifest 为空 + SEO 页仍 `Ø`）；代码 review 把关                  |
| secrets 误进公开仓                                | 高   | `.gitignore` 已忽略 `.env*.local`；部署前 grep 公开仓                                      |
| Google OAuth consent screen 审核延迟              | 低   | 本地用 dev URI 先调通；线上审核同步进行                                                    |

---

## 用户需在代码外做的事

1. **注册 GitHub OAuth App**：Authorization callback URL = `https://growthlanding.ai/api/auth/callback/github`（+ 本地 `http://localhost:3000/api/auth/callback/github`）。拿 Client ID / Secret。
2. **配置 Google OAuth**（Google Cloud Console）：Authorized redirect URI = `https://growthlanding.ai/api/auth/callback/google`（+ 本地）。配置 OAuth consent screen。拿 Client ID / Secret。
3. **Vercel env 配置**：`AUTH_SECRET` + `AUTH_GITHUB_ID` + `AUTH_GITHUB_SECRET` + `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`。

---

## 参考资料

- Auth.js v5 安装（Next.js 16，proxy.ts）: https://authjs.dev/getting-started/installation
- `@auth/drizzle-adapter`: https://authjs.dev/getting-started/adapters/drizzle
- Next.js 16 proxy（原 middleware）: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- Next.js 16 认证指南: `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- GitHub issue #13302（next-auth@4 peer 冲突，用 v5 解决）
- 现有红线：`webui/CLAUDE.md:167-168`、`src/db/schema.ts:10-14`
- 脱敏红线：`webui/CLAUDE.md:64-75`、`001-detail-page-seo-design-optimization.md` 非功能需求

---

## 变更历史

| 日期       | 版本   | 变更内容                                                                       | 作者 |
| ---------- | ------ | ------------------------------------------------------------------------------ | ---- |
| 2026-08-13 | v1.0.0 | 初版 PRD；锁定 P0-1~P0-9（Auth.js 接入 + watchlist + Header 入口 + privacy）；P1（pricing/Creem/提醒）/ P2（API/导出/团队）记录延后。 | AI   |

---

**文档状态**: ✅ 完成 PRD（待人工 review）
**优先级**: P0（本轮）
**预计完成**: 待 review 通过后进入编码（2026-08）
