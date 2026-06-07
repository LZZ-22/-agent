# Prompt 迭代记录

## v1.0 — 基础风格 Prompt（2026-06-02）

**结构**：
- 角色设定 → 风格规范（9 维度）→ 行为约束

**问题**：
- 风格维度过多导致 prompt 冗长
- 缺少场景差异化
- 没有数据库上下文

---

## v1.1 — Scene Patch 双层架构（2026-06-03）

**修改**：
- 拆分为 Base Style Spec + Scene Patch
- 新增 13 个场景补丁
- composePrompt(patch) 动态组装

**预期效果**：
- 不同场景使用不同的语气/结构/行为边界
- 心理支持场景降低调侃、增加共情
- 娱乐场景放大幽默、降低结构化要求

**实际效果**：
- 场景切换有明显差异感
- 心理支持场景的安全边界有效
- 但 Base Spec 和 Patch 之间的权重有时不够灵活

---

## v1.2 — 用户画像注入（2026-06-04）

**修改**：
- 新增 `lib/user-profile.ts`（user_style_profile）
- 所有 Prompt 末尾自动注入 `getUserProfilePrompt()`
- 新增 `lib/dialogue-learning.ts`（6 个对话模块的跨分类学习路径）
- 所有 Prompt 末尾自动注入 `getDialogueLearningPrompt()`

**预期效果**：
- Agent 在所有场景下都遵循用户交流规则
- 能根据对话类型自动查找对应的学习路径

---

## v2.0 — 数据库理解型 Agent（2026-06-05）

**修改**：
- 新增 `lib/db-introspection.ts`（数据库 schema 自动检测）
- 新增 `lib/data-access.ts`（统一数据访问层）
- 新增 `lib/agent-intent.ts`（意图识别：general_chat / database_lookup / database_summary / database_reasoning）
- 新增 `lib/agent-context.ts`（Agent 上下文组装）
- 新增 `app/api/agent/route.ts`（核心 Agent API）

**Prompt 组合逻辑**：
1. 用户消息 → detectIntent() → 判断是否需要数据库
2. 如需数据库 → searchProjectData() / getCategoryStats() → 获取数据
3. buildAgentContext() → 组装 schema + 意图 + 查询结果
4. formatContextForPrompt() → 转为文本
5. buildAgentSystemPrompt() → 风格规范 + 数据规则 + 用户画像 + 学习路径 + 上下文
6. callLLM() → 生成最终回答

**关键改进**：
- 数据库是事实源，LLM 是解释与组织层
- 数据不足时明确说明，不伪造
- 意图识别先规则化（后续可升级为模型判断）
- API 返回结构化结果（含 debug 信息）

**待迭代**：
- 意图识别从规则升级为 LLM 判断
- 支持多轮对话中的上下文延续
- 支持跨表关联查询
