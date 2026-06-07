# 语言样本

## 数据库结构

使用 SQLite 本地数据库（`db/style_samples.db`），通过 `sql.js`（WebAssembly）驱动。

### 表结构

**categories** — 分类表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | TEXT | 分类名称 |
| slug | TEXT | URL 友好标识 |
| description | TEXT | 分类说明 |

**samples** — 样本表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| category_id | INTEGER | 外键 → categories.id |
| content | TEXT | 原始文本内容 |
| source | TEXT | 来源（平台/场景/对话对象） |
| tags | TEXT | 逗号分隔标签 |
| word_count | INTEGER | 字数 |
| char_count | INTEGER | 字符数 |
| language | TEXT | 语言代码（默认 zh） |
| captured_at | TEXT | 采集时间 |
| notes | TEXT | 备注 |

### 预设分类

| ID | 分类 | slug | 说明 |
|----|------|------|------|
| 1 | 日常对话 | daily | 微信/QQ/Slack 等 IM 对话、口头对话记录 |
| 2 | 长文 | longform | 文章、博客、笔记、邮件等长篇幅文本 |
| 3 | 社交媒体文案 | social | 微博、小红书、朋友圈、Twitter 等平台文案 |

### 操作命令

```bash
npm run db:setup    # 初始化/重建数据库
npm run db:query    # 查看数据库状态和统计
```

### 编程接口

```typescript
import { addSample, getSamples, searchSamples, deleteSample, getStats } from "./db/query";

// 添加样本
await addSample({
  categorySlug: "daily",
  content: "今天天气真不错，一起去公园散步吧！",
  source: "微信聊天",
  tags: "日常,天气,邀约",
  notes: "和朋友的非正式对话",
});

// 查询样本
const daily = await getSamples({ categorySlug: "daily", limit: 10 });

// 搜索
const results = await searchSamples("天气");

// 统计
const stats = await getStats();
```

## 当前样本目录

> 待添加：具体语言样本记录
