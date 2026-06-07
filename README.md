# StyleAgent

## 基于风格规范与评估闭环的个人语言风格 AI 对话 Agent

一个可以被"调教"为特定个人语言风格的 AI 助手。通过**风格规范定义 → Prompt 工作流 → 自动评估 → 用户反馈**的闭环机制，持续优化 AI 输出的风格一致性。

> **用途**：AI 人文训练实习生 · 作品集项目  
> **重点**：产品思考、风格标准定义、AI Workflow、评估机制、数据留痕

---

## 项目目标

- 展示如何将主观的"语言风格"转化为可执行、可量化的 Prompt 规则
- 构建风格生成 → 对比评估 → 数据反馈 → Prompt 迭代的完整闭环
- 实现一个可在浏览器中完整体验的 AI 对话产品原型

---

## 功能

| 页面 | 功能 |
|------|------|
| **首页** | 项目介绍、工作流展示、数据概览、快速导航 |
| **风格规范** | 编辑语言风格画像（9 个维度），支持导出 JSON |
| **对话** | 与风格化 Agent 对话，保存对话记录 |
| **对比模式** | 同题对比普通回答 vs 风格化回答，用户偏好投票 + 五维评分 |
| **自动评估** | AI 评审根据风格规范多维度打分 + 修改建议 + 改写 |
| **数据面板** | 评分统计、偏好率、评分趋势图（Recharts）、导出数据 |
| **项目留痕** | 需求定义、规范版本、Prompt 版本、评估标准、测试问题集、迭代记录 |

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 图表 | Recharts |
| 存储 | localStorage（可导出 JSON） |
| AI | DeepSeek V4 Pro（OpenAI 兼容接口） |
| Mock | 内置 Mock 模式（无需 API Key） |

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量（可选）

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
DEEPSEEK_API_KEY=你的_API_Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
```

> **不配置 API Key 也可以运行！** 项目内置 Mock 模式，会自动使用预设的模拟回复，界面和数据面板都可正常体验。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 构建部署

```bash
npm run build
npm start
```

可直接部署到 Vercel。

---

## 项目结构

```
style-agent/
├── app/                     # Next.js App Router
│   ├── api/
│   │   ├── chat/route.ts    # 对话 API（风格化/普通/对比）
│   │   └── evaluate/route.ts # 自动评估 API
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   ├── style-profile/       # 风格规范页
│   ├── chat/                # 对话页
│   ├── compare/             # 对比模式页
│   ├── evaluation/          # 自动评估页
│   ├── dashboard/           # 数据面板页
│   └── project-log/         # 项目留痕页
├── components/
│   ├── ui/                  # Button, Card, Input, Badge, Textarea
│   └── layout/
│       └── app-shell.tsx    # 侧边导航 + 主内容区
├── lib/
│   ├── types.ts             # TypeScript 类型定义
│   ├── prompts.ts           # Prompt Builder + 评估 Prompt
│   ├── llm.ts               # DeepSeek API 调用封装
│   ├── store.ts             # localStorage 数据管理
│   ├── mock.ts              # Mock 数据和回复
│   └── utils.ts             # 工具函数
├── docs/                    # 项目文档 + 进度记录
├── db/                      # SQLite 语言样本数据库
├── .env.example
└── README.md
```

---

## 设计理念

### Prompt 设计

- **生成 Prompt**：将风格规范（9 个维度）编译为 System Prompt，注入对话
- **评估 Prompt**：AI 扮演严格评审，根据规范进行五维打分（JSON 输出）
- **双层设计**：生成和评估分离，独立调优互不干扰

### 评估体系

五维度评分（每项 1-5 分）：
- 风格一致性 · 结构清晰度 · 语言自然度 · 信息有效性 · 避免禁忌表达

### 数据闭环

```
用户输入 → 风格化生成 → 对比评估 → 用户投票/评分 → 数据面板 → Prompt 迭代
```

---

## 后续优化方向

1. **Few-shot 示例注入** — 在 prompt 中嵌入风格样本，提升一致性
2. **场景感知** — 不同问题类型匹配不同回答策略
3. **A/B 测试框架** — 系统化对比不同 prompt 版本的效果
4. **OAuth 登录** — 多用户支持，独立风格画像
5. **数据库迁移** — 从 localStorage 升级到 SQLite/PostgreSQL
6. **流式输出** — 提升对话体验

---

## License

MIT — 本作品集项目可供学习和参考。
