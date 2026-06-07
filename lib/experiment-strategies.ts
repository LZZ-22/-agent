// 实验策略配置 — 用于多版本 Agent 横向对比

export interface AgentStrategy {
  id: string;
  name: string;
  description: string;
  useDatabase: boolean;
  useStyle: boolean;
  useGuardrails: boolean;
}

export const AGENT_STRATEGIES: AgentStrategy[] = [
  {
    id: "baseline_direct_llm",
    name: "Baseline / Direct LLM",
    description: "不接数据库，不加风格，只做基础回答",
    useDatabase: false,
    useStyle: false,
    useGuardrails: false,
  },
  {
    id: "db_augmented_agent",
    name: "DB Augmented Agent",
    description: "接数据库，基于数据库事实回答，不注入风格",
    useDatabase: true,
    useStyle: false,
    useGuardrails: false,
  },
  {
    id: "db_augmented_with_style",
    name: "DB + Style Agent",
    description: "数据库增强 + 风格化输出",
    useDatabase: true,
    useStyle: true,
    useGuardrails: false,
  },
  {
    id: "db_augmented_with_style_and_guardrails",
    name: "DB + Style + Guardrails",
    description: "数据库增强 + 风格 + 严格边界约束（当前生产策略）",
    useDatabase: true,
    useStyle: true,
    useGuardrails: true,
  },
];

export function getStrategy(id: string): AgentStrategy | undefined {
  return AGENT_STRATEGIES.find((s) => s.id === id);
}
