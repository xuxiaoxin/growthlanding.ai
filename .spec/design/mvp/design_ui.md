# growthinglanding.ai — MVP UI 设计文档（V1）

---

## 一、设计目标

本 UI 设计服务于一个核心目标：

👉 **让用户在 3 分钟内生成可用的 SEO Landing Pages**

设计原则：

* 极简输入（降低门槛）
* 快速反馈（增强感知价值）
* 默认自动化（减少用户决策）
* 强结果导向（突出生成内容）

---

## 二、整体页面结构

MVP 仅包含 3 个核心页面：

```
1. 首页（输入页）
2. 生成过程页（Loading页）
3. 结果页（核心页面）
```

---

## 三、首页（输入页）

### 🎯 目标

让用户在 **30秒内开始生成**

---

### 🖥 页面结构

```
[Logo]

H1: Turn Trends into SEO Pages in Minutes
副标题: Generate high-ranking landing pages from trending topics — automatically.

[主输入框]
Describe your product...

[辅助输入]
Product URL (optional)

[折叠区]
▼ Advanced options

- Upload product docs
- Target audience

[按钮]
🚀 Generate SEO Pages

[辅助按钮]
👉 Try with an example
```

---

### ✍️ 文案建议

输入框 placeholder：

> e.g. An AI tool that helps teachers grade essays

---

### ⚠️ 设计重点

* 只保留一个核心输入框
* 高级选项默认折叠
* 不增加复杂表单

---

## 四、生成过程页（Loading页）

### 🎯 目标

增强用户对“AI能力”的感知

---

### 🖥 页面结构

```
🧠 Analyzing your product...

✔ Understanding your product
✔ Finding relevant trends
✔ Generating keywords
⏳ Creating SEO pages...

[进度条]

预计时间：20-40秒
```

---

### 💡 动态反馈（推荐）

```
🔥 Found trend: DeepSeek
🔍 Generated keyword: "AI essay grading tool"
📝 Creating page #3...
```

---

### ⚠️ 设计重点

* 必须有实时变化内容
* 避免“假死 loading”

---

## 五、结果页（核心页面）

---

### 🧱 Block 1：结果总结

```
🎉 Your SEO Pages are Ready

We generated:
- 10 Landing Pages
- 35 Keywords
- Based on 5 trends

[按钮]
⬇ Download All
📄 Export as Markdown
```

---

### 🧱 Block 2：页面列表（核心）

每个页面卡片：

```
------------------------------
🔥 Trend: DeepSeek

Keyword:
deepseek essay grading

Title:
Can DeepSeek Grade Essays? Full Guide (2026)

[按钮]
👁 Preview
📋 Copy
⬇ Download
------------------------------
```

---

### 🧱 Block 3：页面预览区

```
----------------------------------
# Can DeepSeek Grade Essays?

内容...

[CTA按钮]
Try [Product Name]
----------------------------------
```

---

### ⚠️ 设计重点

* 卡片清晰、可快速浏览
* 预览区必须存在（增强成就感）
* 支持快速复制

---

## 六、核心交互逻辑

---

### 1️⃣ 默认自动生成

* 不让用户选择热点
* 自动生成全部结果

---

### 2️⃣ 可编辑（但非必须）

* 标题可编辑
* 内容可编辑

---

### 3️⃣ 一键导出

必须支持：

* Copy Markdown
* Copy HTML

---

## 七、输入结构设计（关键优化）

---

### 输入优先级

```
1️⃣ Product Docs（最详细）
2️⃣ Product URL
3️⃣ 简单描述
```

---

### UI呈现方式

```
主输入：Describe your product

辅助输入：Product URL

高级输入（折叠）：
- Upload product docs
```

---

### 上传反馈（推荐）

```
📄 Product doc uploaded
→ Detected: AI writing tool for teachers
```

---

## 八、Demo模式（强烈建议）

首页增加：

```
👉 See Example Output
```

点击后直接展示结果页示例：

* 降低理解成本
* 提升转化率

---

## 九、技术实现建议

---

### 前端

* Next.js
* Tailwind CSS

---

### 页面路由

```
/           → 首页
/loading    → 生成页
/result     → 结果页
```

---

## 十、MVP范围（严格控制）

---

### ✅ 必须做

* 输入产品信息
* 生成页面
* 展示结果
* 支持复制导出

---

### ❌ 不做

* 自动发布
* SEO排名监控
* 外链系统
* 高级数据分析

---

## 十一、产品核心体验总结

---

用户流程：

```
输入一句话
→ 点击生成
→ 等30秒
→ 拿走10个页面
```

---

## 十二、一句话产品体验

> 像“Midjourney 生成图片”一样生成 SEO 页面

---


# growthinglanding.ai — UI 设计风格规范（MVP）

---

## 一、设计定位（核心定义）

growthinglanding.ai 的 UI 不是传统工具界面，而是：

> **一个“AI生成器产品”，而不是“分析工具”**

---

### 🎯 设计目标

* 3分钟内完成用户核心任务
* 强化“生成感”（AI正在创造价值）
* 降低使用门槛（极简输入）
* 突出“结果资产”（SEO页面）

---

## 二、整体风格定义

### 🧠 风格关键词

```text
Dark / Minimal / AI-native / Futuristic / Productized
```

---

### 🎨 风格融合模型

本产品UI融合三类产品风格：

| 类型      | 作用       |
| ------- | -------- |
| AI生成器风格 | 强调“生成能力” |
| 开发者工具风格 | 提供结构与效率  |
| 内容产品风格  | 提供可读性    |

---

## 三、视觉系统（Design Tokens）

---

### 🎨 颜色系统

```css
/* 主背景 */
background: #0B0F14;

/* 卡片背景 */
background-card: #111827;

/* 主色（Primary） */
primary: #4F46E5;

/* 强调色（CTA） */
accent: #6366F1;

/* 边框 */
border: #374151;

/* 文字 */
text-primary: #FFFFFF;
text-secondary: #9CA3AF;
text-muted: #6B7280;
```

---

### 🔤 字体系统

```text
Font: Inter / System UI

H1: 32px - 40px
H2: 24px - 28px
H3: 18px - 20px
Body: 14px - 16px
Caption: 12px
```

---

### 📐 间距系统

```text
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

---

### 🔲 圆角与阴影

```css
border-radius: 12px (默认卡片)
border-radius-lg: 16px

shadow: soft (hover时增强)
```

---

## 四、核心UI结构

---

### 1️⃣ 首页（输入页）

---

#### 🎯 设计目标

* 快速进入生成流程
* 不增加认知负担

---

#### 🧩 结构

```text
[Logo]

[H1 大标题]
[副标题]

[主输入框]

[辅助输入：URL]

[折叠区：高级选项]

[主按钮：Generate]

[Demo入口]
```

---

#### ⚠️ 设计原则

* 只保留一个核心输入框
* 高级功能隐藏
* 强化 CTA

---

---

### 2️⃣ Loading页（生成过程）

---

#### 🎯 设计目标

让用户“感知AI正在工作”

---

#### 🧩 结构

```text
[标题：Analyzing...]

[步骤状态列表]

[进度条]

[动态日志流]
```

---

#### ✨ 动效规范

* 打字效果（Typewriter）
* Loading Skeleton
* 日志滚动

---

#### ❗ 禁止

* 静态 loading
* 无反馈等待

---

---

### 3️⃣ 结果页（核心页面）

---

#### 🎯 设计目标

让用户感受到：

> “我获得了一批可用的流量资产”

---

#### 🧩 页面结构

```text
[顶部 Summary]

[左侧：页面卡片列表]

[右侧：页面预览]
```

---

---

## 五、核心组件设计

---

### 🧩 1. SEO页面卡片

---

#### 结构

```text
[Trend 标签]

[Keyword]

[Title]

[操作按钮]
- Preview
- Copy
- Download
```

---

#### 行为

* hover：放大 + 边框高亮
* click：更新右侧预览

---

---

### 🧩 2. 页面预览区

---

#### 结构

```text
[标题]

[正文内容]

[CTA区块]
```

---

#### 设计要求

* 类似真实网页
* 可滚动
* CTA突出

---

---

### 🧩 3. 按钮系统

---

#### Primary Button

```text
颜色：Primary
用途：核心操作（生成、下载）
```

---

#### Secondary Button

```text
颜色：灰色
用途：辅助操作（复制、预览）
```

---

---

## 六、交互设计原则

---

### 1️⃣ 默认自动化

```text
不让用户做选择
→ 自动生成全部结果
```

---

### 2️⃣ 即时反馈

```text
每一步都要有反馈
```

---

### 3️⃣ 可用优先

```text
生成结果必须“可直接使用”
```

---

---

## 七、动效设计（关键加分项）

---

### 🎬 动效列表

| 场景       | 动效         |
| -------- | ---------- |
| Loading  | 打字 + 进度条   |
| 卡片 hover | scale + 阴影 |
| 页面切换     | slide-in   |
| 点击按钮     | 微缩放        |

---

---

## 八、体验哲学（最重要）

---

### ❌ 错误体验

* 像 SEO 工具
* 像数据后台
* 需要学习

---

### ✅ 正确体验

> 像一个“AI机器”，帮你自动产出结果

---

---

## 九、一句话设计原则

---

> **让用户感觉不是在“使用工具”，而是在“调用一个自动赚钱的系统”**

---

---

## 十、MVP设计边界

---

### ✅ 必须有

* 输入 → 生成 → 结果完整链路
* 页面卡片
* 预览区
* 导出能力

---

### ❌ 不需要

* 复杂图表
* 数据分析面板
* 高级SEO指标

---

---

## 十一、总结

---

growthinglanding.ai 的 UI 本质：

> **一个“AI生成引擎的控制面板”，而不是传统工具界面**

---

