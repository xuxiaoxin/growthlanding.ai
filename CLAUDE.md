# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**growthlanding.ai** — 将热点趋势自动转化为 SEO Landing Pages 的 AI 工具。用户输入产品描述，系统自动匹配热点、生成关键词，输出 10 个可直接上线的 SEO 页面。

核心流程：输入产品信息 → AI 生成热点 + 关键词 → 输出 10 个 Landing Page（含 SEO 标题、Meta Description、URL slug、正文 1000-1500 字、FAQ、CTA）

## 技术栈

- **前端**: Next.js (App Router) + Tailwind CSS
- **后端**: Next.js API Routes
- **LLM**: DeepSeek API
- **语言**: TypeScript

## 常用命令

- `npm run dev` — 启动开发服务器
- `npm run build` — 构建项目
- `npm run lint` — 代码检查

## 项目结构

- `src/app/` — 页面路由（App Router）
  - `/` — 首页（输入页）
  - `/loading` — 生成过程页
  - `/result` — 结果页
- `src/app/api/generate/` — SSE 流式生成接口
- `src/components/` — UI 组件
- `src/lib/deepseek.ts` — DeepSeek API 封装
- `src/lib/prompts/` — LLM Prompt 模板
- `src/lib/export/` — 导出工具（Markdown/HTML）
- `src/types/` — 类型定义

## 设计规范

暗色 / AI 原生 / 未来感风格，定位为"AI 生成引擎控制面板"：
- 背景色：`#0B0F14`，卡片：`#111827`，主色：`#4F46E5`，强调色：`#6366F1`
- 边框：`#374151`，文字主色：`#FFFFFF`，次要：`#9CA3AF`，弱化：`#6B7280`
- 字体：Inter / System UI
- 圆角：12px（卡片）、16px（大组件）

## MVP 边界

- **做**：输入 → 生成 → 展示结果 → 复制/导出（Markdown + HTML）
- **不做**：自动发布、排名监控、外链系统、高级 SEO 分析、自动抓取热点
