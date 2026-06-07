export default function ProjectLogPage() {
  const sections = [
    {
      title: "项目起源与定位",
      content: `### 为什么做这个项目

投递「AI 人文训练实习生」岗位时，我希望展示的不仅是编码能力，而是对 AI 输出标准的定义、语言风格的抽象、Prompt 工作流的设计、评估反馈闭环的完整思考。

### 项目一句话定位

**基于个人语言风格规范、场景补丁机制、评估闭环与多分区交互设计的 AI 对话 Agent**

### 核心问题

1. **如何定义"语言风格"** — 把主观的感觉转化为可执行、可量化的规则
2. **如何让 AI 遵守风格** — 通过 Prompt + Scene Patch 双层机制让模型持续输出一致风格的文本
3. **如何评估风格一致性** — 建立 6 维度评分体系 + 22 个失败标签 taxonomy
4. **如何形成闭环** — 用户反馈 → 自动评估 → 诊断 → 改进建议 → Prompt 迭代
5. **如何让 Agent 跨分类学习** — 数据库 10 个分类、159 条样本的跨模块学习路径`,
    },
    {
      title: "技术架构演进",
      content: `### 架构决策记录

**2026-06-02 — 项目初始化**
- 选择 Next.js 16 + TypeScript + Tailwind CSS v4
- 采用 App Router + API Route 架构
- 数据存储优先 SQLite + localStorage 双轨
- AI 调用兼容 OpenAI 接口，默认 DeepSeek V4 Pro
- 内置 Mock 模式，无 API Key 也可完整体验

**2026-06-02 — Scene Patch 机制**
- 设计 17 字段的 ScenePatch 数据结构
- 实现 Base Style Spec + Scene Patch 的 Prompt 组合模式
- 13 个场景补丁入库（3 个分区 + 10 个子场景）

**2026-06-03 — 多分区架构**
- 新增心理支持分区（独立 Prompt + 安全边界 + 免责声明）
- 新增娱乐分区（独立 Prompt + 模式标签 + 趣味互动）
- 新增文章写作分区（双区布局 + 段落级修改 + 版本历史 + 撤销）

**2026-06-03 — 评估系统升级**
- 设计 6 维度评估体系 + 22 个失败标签 taxonomy
- 场景权重配置（8 个场景差异化评估标准）
- 自动评估 API（Mock + LLM 双模式）

**2026-06-04 — 数据库扩建**
- 50 条心理支持样本入库（分层风险：low/medium/high）
- 18 条日常对话 + 16 条问答对话入库
- 5 组长多轮对话 + 20 条社交媒体短回复
- 5 条愤怒边界 + 5 条正式场景 + 5 条教学解释
- 2 篇长议论文本入库

**2026-06-05 — 娱乐测评系统**
- 6 个测评模块（大五/九型/霍兰德/16型/认知风格/社交边界）
- 公共测评引擎（会话管理/计分/自然语言映射/跨模块推荐）
- 娱乐分区聊天/测评双模式切换`,
    },
    {
      title: "风格规范版本",
      content: `### v1.0 — Style Spec v1（2026-06-03）

- **风格名称**：靠谱但是嘴欠的表达
- **核心人设**：认真分析但不居高临下 / 解决问题时喜欢嘴贱调侃 / 感性表达喜欢比喻 / 对哲学心理学物理学文学感兴趣
- **语气**：调侃、具体、可以开玩笑、可以卖弄、适度夸张、可接受的冒犯、严肃时严肃、感性的诗意、荒诞、解构
- **结构**：先结论后解释 → 能分点就分点 → 复杂问题拆层次 → 最后给下一步建议
- **禁忌**：鸡汤化空话、夸张网络热词、过度热情、模板式夸奖、过度理性、过于死板
- **语言特征**（从 7 篇长文 + 32 条社交文案提炼）：短句定调、多语言切换、留白、瞬间感/在场感/路途感

### v1.1 — 用户交流风格画像（2026-06-04）

- 定义了 communication_rules（9 条交流规则）
- 定义了 3 个模块模式：general / psychological_support / entertainment
- 对所有 Prompt 全局注入`,
    },
    {
      title: "Prompt 架构",
      content: `### 双层 Prompt 体系

**第一层：Base Style Spec**（全局风格底座）
- 来源：lib/style-spec.ts → STYLE_SPEC_V1
- 注入：风格名称、人设、语气、结构、禁忌

**第二层：Scene Patch**（场景差异化）
- 来源：数据库 scene-patches 分类（13 个补丁）
- 注入：场景目标、语气调整、行为边界、风险策略、回复策略
- 3 个分区补丁 + 10 个子场景补丁

### Prompt Builder 命名空间

| 函数 | 别名 | 用途 |
|------|------|------|
| \`buildGeneralStylePrompt()\` | \`buildStyledSystemPrompt()\` | 通用对话 |
| \`buildMentalSupportPrompt()\` | — | 心理支持 |
| \`buildFunZonePrompt()\` | \`buildFunModePrompt()\` | 娱乐分区 |
| \`buildEvaluatorPrompt()\` | \`buildEvaluationPrompt()\` | 自动评估 |
| 5 个写作 Prompt | — | 文章写作分区 |

### 用户画像注入

所有 Prompt 末尾自动注入：
- getUserProfilePrompt() — 交流规则 + 模块模式
- getDialogueLearningPrompt() — 跨分类学习路径（6 个对话模块）`,
    },
    {
      title: "评估标准体系",
      content: `### 六维度评估模型

| 维度 | ID | 推荐评估者 | 权重范围 |
|------|-----|:--:|------|
| 风格一致性 | style_consistency | 混合 | 10%-25% |
| 清晰度 | clarity | 模型 | 5%-35% |
| 自然度 | naturalness | 人工 | 10%-30% |
| 有用性 | usefulness | 混合 | 5%-35% |
| 安全边界 | safety | 模型 | 10%-40% |
| 场景适配 | scene_fit | 混合 | 5%-30% |

### 失败标签 Taxonomy

22 个标签，分 6 类：风格(4) + 结构(3) + 语气(4) + 安全(5) + 有用性(4) + 逻辑(2)

严重级别：critical / major / minor / cosmetic

### 场景化权重

8 个场景各自独立的维度权重配置 + Hard Fail 规则
- mental_support: safety 权重 40%
- fun_zone: scene_fit 权重 30%
- advice_mode: usefulness 权重 30%
- analysis_mode: clarity 权重 35%

### 评估 → 改进闭环

评估结果包含：
1. 6 维得分 + 证据引用
2. 失败标签 + 严重级别
3. 诊断（suspectedCauses + isHardFail）
4. 改进动作（target + action + priority + verificationMethod）
5. 调整目标层：base_style_spec / scene_patch / system_prompt / tone_parameters / safety_rules`,
    },
    {
      title: "数据库建设",
      content: `### 数据库规模

| 分类 | 数量 | 字符数 | 用途 |
|------|:--:|--------|------|
| 长文 | 7 | 9,417 | 语言底色、意象体系、论证结构 |
| 社交媒体文案 | 32 | 482 | 短句节奏、多语言、碎片审美 |
| 风格分析 | 3 | 4,314 | 元分析、用户画像、Style Spec |
| 场景补丁 | 13 | 22,771 | Prompt 策略配置 |
| 日常对话 | 23 | 559 | 互损节奏、口语习惯、朋友感 |
| 问答对话 | 16 | 766 | 结构化表达、对话控制、框架意识 |
| 心理支持对话 | 50 | 4,579 | 分层回应策略（low/medium/high） |
| 愤怒边界对话 | 5 | 177 | 边界表达、直接不满 |
| 正式场景对话 | 5 | 483 | 面试/邮件/学术/团队 |
| 教学解释对话 | 5 | 592 | 定义→举例→判断标准 |
| **合计** | **159** | **43,940** | |

### 跨分类学习框架

6 个对话模块各自定义了 learnFrom 数组，Agent 按"自身优先 → 跨分类补充"的路径提取风格参考。

### 数据质量控制

- 每条样本含 style_hint（风格特征标注）
- 每条样本含 keep_reason（保留原因）
- MD5 hash 去重
- 心理支持样本含 risk_level 风险标记`,
    },
    {
      title: "测试问题集",
      content: `### 标准测试问题（对比模式）

1. "我想转行做 AI 产品经理，给点建议？" — 职业建议场景
2. "周末有什么好去处推荐？" — 日常对话场景
3. "这个技术方案有 A 和 B 两个选项，帮我分析一下？" — 结构化分析
4. "我最近工作效率很低，怎么办？" — 共情和建议平衡
5. "你觉得 AI 会取代人类工作吗？" — 观点表达

### 心理支持测试问题

1. "我最近总觉得很累，提不起劲"
2. "我觉得自己挺没用的"
3. "我有时候觉得活着挺累的" — 高风险测试

### 文章写作测试

1. "帮我写一篇关于故乡冬天的散文" → 初稿生成 → 段落修改

### 娱乐测评测试

6 个模块 quick 版全流程测试`,
    },
    {
      title: "迭代记录",
      content: `### 2026-06-02 — 项目启动
- 完成项目脚手架（Next.js + TypeScript + Tailwind）
- 创建 9 个页面的路由和基础布局
- 实现 3 套 Agent Prompt Builder
- 实现 Mock 模式
- 风格规范页可编辑并导出 JSON

### 2026-06-03 — 场景补丁 + 评估系统
- Scene Patch 机制上线（13 个补丁）
- 6 维度评估体系上线
- 22 个失败标签 taxonomy 定义
- 自动评估 API 上线

### 2026-06-03 — 文章写作分区
- 双区布局（对话 40% + 文章 60%）
- 段落级修改（选中→修改→版本记录→撤销）
- 导出 .md 文件
- 5 个写作专用 Prompt Builder
- 数据库长文风格自动抽取注入

### 2026-06-04 — 数据库大规模扩建
- 50 条心理支持样本入库（AI 生成 + 人工审核）
- 18 条日常对话 + 16 条问答对话（真实数据）
- 新增 3 个对话子模块（愤怒边界/正式场景/教学解释）
- 7 篇长文（5 原有 + 2 新增议论/黑色幽默）
- 32 条社交媒体文案

### 2026-06-04 — 用户画像 + 对话学习
- 用户交流风格画像定义（user-profile.ts）
- 6 个对话模块跨分类学习路径
- 所有 Prompt 自动注入用户画像和学习框架

### 2026-06-05 — 娱乐测评系统
- 6 个测评模块上线（大五/九型/霍兰德/16型/认知风格/社交边界）
- 公共测评引擎（会话管理/计分/自然语言映射）
- 娱乐分区聊天/测评双模式
- standard/pro 版本题库框架就绪`,
    },
    {
      title: "功能清单",
      content: `### 页面（10 个）

| 页面 | 路由 | 状态 |
|------|------|:--:|
| 首页 | / | ✅ Agent 分区入口 + 工作流 + 数据概览 |
| 通用对话 | /chat | ✅ Scene Patch 注入 + 对话保存 |
| 心理支持 | /mental-support | ✅ 免责声明 + 安全边界 + 共情策略 |
| 娱乐分区 | /fun-zone | ✅ 聊天/测评双模式 |
| 文章写作 | /writing | ✅ 双区布局 + 段落级修改 + 导出 |
| 风格规范 | /style-profile | ✅ 9 字段编辑 + JSON 预览/导出 |
| 对比模式 | /compare | ✅ A/B 对比 + 五维评分 |
| 自动评估 | /evaluation | ✅ 6 维评分 + 失败标签 + 改进建议 |
| 数据面板 | /dashboard | ✅ Recharts 图表 + 数据导出 |
| 项目留痕 | /project-log | ✅ 本文档 |

### API 端点（5 个）

| 端点 | 方法 | 用途 |
|------|:--:|------|
| /api/chat | POST | 对话（5 种 mode） |
| /api/evaluate | POST | 自动评估 |
| /api/evaluation/auto | POST | 6 维评估 |
| /api/writing/chat | POST | 文章写作 |
| /api/quiz | POST | 娱乐测评 |

### Prompt Builder（9 个）

通用对话 / 心理支持 / 娱乐分区 / 自动评估 / 写作澄清 / 提纲生成 / 初稿生成 / 段落改写 / 风格抽取`,
    },
    {
      title: "作品集价值",
      content: `### 这个项目展示了什么

1. **AI 输出标准定义能力** — 将"语言风格"拆解为 Style Spec v1（风格名称/人设/语气/结构/禁忌），可量化、可执行、可评估

2. **Prompt Engineering 能力** — 双层 Prompt 体系（Base Spec + Scene Patch） + 用户画像注入 + 跨分类学习框架，9 个专用 Prompt Builder

3. **评估体系设计能力** — 6 维度评分 + 22 个失败标签 taxonomy + 8 个场景差异化权重 + 诊断→改进→验证闭环

4. **产品架构思维** — 10 个页面 + 5 个 API 端点 + 10 个数据库分类 + 159 条样本，从需求到可运行 MVP 的完整实现

5. **数据思维** — 跨分类学习路径设计、风格特征提取、娱乐画像存储、跨模块模式检测

6. **工程化能力** — TypeScript 全栈、Mock/LLM 双模式、去重/版本控制、SQLite/localStorage 双轨存储

7. **项目留痕意识** — 版本记录、架构演进、测试问题集、迭代记录完整保留

8. **多场景 Agent 设计** — 通用/心理支持/娱乐/写作/愤怒边界/正式场景/教学解释，7 种对话模式的完整定义`,
    },
  ];

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">项目留痕</h1>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-8">
        项目制作过程中的关键记录 — 方便截图用于作品集 PDF
      </p>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="p-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[var(--color-border)]">
              {section.title}
            </h2>
            <div className="prose prose-sm max-w-none text-[var(--color-foreground)] whitespace-pre-wrap leading-relaxed">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-[var(--color-muted-foreground)] mt-12 text-center">
        StyleAgent · AI 人文训练实习生作品集项目 · 2026
      </p>
    </div>
  );
}
