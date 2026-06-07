// 对话学习系统 — Agent 跨分类风格学习指引
// 告诉 Agent 如何利用数据库中的多个分类来理解用户的语言风格

export const DIALOGUE_LEARNING_GUIDE = {
  version: "1.0.0",
  description: "Agent 对话风格学习框架 — 通过跨分类参考来理解用户的表达方式",

  categories: {
    daily_chat: {
      name: "日常对话",
      slug: "daily-chat",
      purpose: "学习用户在非正式、日常交流中的语气、节奏和互动模式",
      learnFrom: [
        { category: "日常对话 (daily-chat)", what: "互损节奏、表情包节奏、朋友间的松弛表达方式——这是最直接的语料来源" },
        { category: "长文 (longform)", what: "语言风格底色、意象偏好、句式特征、留白习惯" },
        { category: "社交媒体文案 (social)", what: "短句表达能力、多语言切换、碎片化表达中的情绪传递" },
        { category: "风格分析 (style-analysis)", what: "已提炼的语气关键词、审美倾向、结构模式" },
      ],
      styleFocus: ["轻松自然", "口语化但不随意", "有互动感", "允许短句和跳跃"],
    },
    qa_dialogue: {
      name: "问答对话",
      slug: "qa-dialogue",
      purpose: "学习用户在分析、建议、观点表达场景中的思维方式和表达结构",
      learnFrom: [
        { category: "问答对话 (qa-dialogue)", what: "对话控制、反客为主、框架意识——自身的结构化表达和话题主导能力" },
        { category: "场景补丁 (scene-patches)", what: "各场景的回复策略、结构要求、语气调整规则" },
        { category: "风格分析 (style-analysis)", what: "用户交流规则 (communication_rules)、模块模式定义" },
        { category: "长文 (longform)", what: "复杂问题的拆解方式、论证结构、从具体到抽象的推进方法" },
      ],
      styleFocus: ["结论先行", "结构清晰", "建议可执行", "有理有据但不死板"],
    },
    psych_dialogue: {
      name: "心理支持对话",
      slug: "psych-dialogue",
      purpose: "学习用户在情绪支持、共情回应、温和陪伴场景中的表达方式",
      learnFrom: [
        { category: "心理支持对话 (psych-dialogue)", what: "分层回应策略——低风险用玩笑切入→中风险认真接住→高风险立刻严肃切换" },
        { category: "日常对话 (daily-chat)", what: "面对低风险情绪时，可借鉴日常对话中的互损节奏和轻松表达来降低压迫感，避免过度正式化" },
        { category: "场景补丁 (scene-patches)", what: "mental_support 补丁的共情策略、安全边界、回退规则" },
        { category: "风格分析 (style-analysis)", what: "用户交流规则中的 psychological_support_module 行为定义" },
        { category: "社交媒体文案 (social)", what: "温柔表达、短句留白、不把话说满的情感传递方式" },
      ],
      styleFocus: ["先共情后分析", "温和不评判", "给空间不催促", "必要时引导现实支持"],
    },
    anger_boundary: {
      name: "愤怒边界对话",
      slug: "anger-boundary",
      purpose: "学习用户在不满、被冒犯、边界被侵犯时的表达方式",
      learnFrom: [
        { category: "愤怒边界对话 (anger-boundary)", what: "直接表达不满、划线不绕弯、保持逻辑不失控——这是愤怒时最核心的语料" },
        { category: "日常对话 (daily-chat)", what: "互损节奏和直接表达的尺度——愤怒时是互损的升级版" },
        { category: "风格分析 (style-analysis)", what: "communication_rules 中的边界定义和直接表达偏好" },
        { category: "问答对话 (qa-dialogue)", what: "对话控制能力——如何在不满时仍保持框架主导" },
      ],
      styleFocus: ["直接但不失控", "先划线再指出问题", "不提供多余解释", "可以带刺但保持逻辑"],
    },
    formal_scene: {
      name: "正式场景对话",
      slug: "formal-scene",
      purpose: "学习用户在面试、邮件、学术讨论、团队协作等正式场景中的表达模式",
      learnFrom: [
        { category: "正式场景对话 (formal-scene)", what: "克制表达、结构化分点、务实导向——在正式场合中保持个人风格的基准" },
        { category: "问答对话 (qa-dialogue)", what: "结构化表达和分点论述的能力" },
        { category: "风格分析 (style-analysis)", what: "核心价值中的 accuracy、clarity、efficiency——正式场景是这些的集中体现" },
        { category: "长文 (longform)", what: "议论文中的论证结构和判断方式" },
      ],
      styleFocus: ["克制但不失个人风格", "务实导向", "结构化分点", "承认问题并给方案"],
    },
    teaching_explain: {
      name: "教学解释对话",
      slug: "teaching-explain",
      purpose: "学习用户在向他人解释概念、方法、原理时的表达方式",
      learnFrom: [
        { category: "教学解释对话 (teaching-explain)", what: "先定义再举例、用比喻降低理解成本、落到判断标准——讲解时的核心结构" },
        { category: "长文 (longform)", what: "拆解复杂问题的层次感、从具体到抽象的推进方式" },
        { category: "问答对话 (qa-dialogue)", what: "定义—举例—判断标准的三段式讲解结构" },
        { category: "场景补丁 (scene-patches)", what: "learning_mode 的回复策略和解释深度偏好" },
      ],
      styleFocus: ["先下定义再举例", "用比喻降低理解成本", "不炫技不堆术语", "落到可执行的判断标准"],
    },
  },

  // Agent 在生成回复时的参考顺序
  agentReferenceOrder: [
    "1. 确认当前对话属于哪种类型（日常/问答/心理支持/愤怒边界/正式场景/教学解释）",
    "2. 查阅对应分类的 learnFrom，跨分类提取风格参考",
    "3. 叠加用户交流风格画像 (user-profile.ts) 中的对应模块模式",
    "4. 叠加场景补丁 (scene-patches) 中的回复策略",
    "5. 生成本轮回复",
  ],
};

export function getDialogueLearningPrompt(): string {
  const g = DIALOGUE_LEARNING_GUIDE;
  return `## 对话风格学习框架
Agent 在回复时应参考以下跨分类学习路径：

### 日常对话模式
当用户处于闲聊、社交、日常交流场景时：
${g.categories.daily_chat.learnFrom.map((l) => `- 参考 **${l.category}**：${l.what}`).join("\n")}
风格重点：${g.categories.daily_chat.styleFocus.join("、")}

### 问答对话模式
当用户提出问题、寻求建议、需要分析时：
${g.categories.qa_dialogue.learnFrom.map((l) => `- 参考 **${l.category}**：${l.what}`).join("\n")}
风格重点：${g.categories.qa_dialogue.styleFocus.join("、")}

### 心理支持对话模式
当用户表达情绪、压力、困扰，需要被理解和陪伴时：
${g.categories.psych_dialogue.learnFrom.map((l) => `- 参考 **${l.category}**：${l.what}`).join("\n")}
风格重点：${g.categories.psych_dialogue.styleFocus.join("、")}

### 愤怒边界对话模式
当用户表达不满、被冒犯、或需要设立边界时：
${g.categories.anger_boundary.learnFrom.map((l) => `- 参考 **${l.category}**：${l.what}`).join("\n")}
风格重点：${g.categories.anger_boundary.styleFocus.join("、")}

### 正式场景对话模式
当处于面试、邮件、学术讨论、团队协作等正式场合时：
${g.categories.formal_scene.learnFrom.map((l) => `- 参考 **${l.category}**：${l.what}`).join("\n")}
风格重点：${g.categories.formal_scene.styleFocus.join("、")}

### 教学解释对话模式
当需要向他人讲解概念、方法或原理时：
${g.categories.teaching_explain.learnFrom.map((l) => `- 参考 **${l.category}**：${l.what}`).join("\n")}
风格重点：${g.categories.teaching_explain.styleFocus.join("、")}

### 生成回复的参考顺序
${g.agentReferenceOrder.join("\n")}`;
}
